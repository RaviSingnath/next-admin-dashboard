import Stripe from "stripe";
import {
  extractId,
  getInvoicePaymentIds,
  getSubscriptionId,
  resolveCollegeIdFromInvoice,
  toIso,
} from "@/lib/stripe/helpers"; // getSubscriptionId now lives here — single source of
// truth, no longer redefined locally in this file (it was previously
// duplicated with a dead copy also sitting unused in the subscription
// handlers file)
import { getTransactionsByInvoiceId } from "../stripe.queries";
import {
  insertBillingTransactions,
  updateTransactionsByInvoiceId,
} from "../stripe.mutations";
import { Errors } from "@/lib/errors/error-factory";
import { mapSupabaseError } from "@/lib/errors/supabase-error";
import { createAdminClient } from "@/lib/supabase/admin";

export async function onInvoicePaid(invoice: Stripe.Invoice): Promise<void> {
  const [collegeId, { paymentIntentId, chargeId }] = await Promise.all([
    resolveCollegeIdFromInvoice(invoice),
    getInvoicePaymentIds(invoice.id),
  ]);

  const subscriptionId = getSubscriptionId(invoice);

  if (!subscriptionId) return; // one-off invoice, not subscription billing

  if (!collegeId) {
    throw Errors.collegeNotAssigned();
  }

  // NOTE: assumes a 2-decimal-place currency (e.g. INR, USD). Stripe's
  // amount fields are always the smallest currency unit, which is not
  // always cents/paise — zero-decimal currencies (e.g. JPY) would need
  // amountMinor used as-is, not divided by 100. Not a concern while
  // billing is INR/USD-only, but don't copy this line if that changes.
  const amountMinor = invoice.amount_paid;

  const row = {
    college_id: collegeId,
    stripe_invoice_id: invoice.id,
    stripe_payment_intent_id: paymentIntentId,
    stripe_charge_id: chargeId,
    stripe_customer_id: extractId(invoice.customer),
    stripe_subscription_id: subscriptionId,
    amount: amountMinor / 100,
    amount_minor: amountMinor,
    currency: invoice.currency,
    status: "succeeded" as const,
    transaction_action: "charge",
    source_type: "subscription",
    invoice_number: invoice.number ?? null,
    invoice_pdf_url: invoice.invoice_pdf ?? null,
    paid_at:
      toIso(invoice.status_transitions?.paid_at) ?? new Date().toISOString(),
  };

  const { data: existing, error } = await getTransactionsByInvoiceId(
    invoice.id,
  );

  if (error) throw mapSupabaseError(error);

  const supabase = createAdminClient();
  const { error: updateError } = await supabase
    .from("college_subscriptions")
    .update({
      latest_invoice_id: invoice.id,
      stripe_latest_invoice_number: invoice.number,
      latest_invoice_url: invoice.hosted_invoice_url ?? null,
      currency: invoice.currency,
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", subscriptionId);

  if (updateError) throw mapSupabaseError(updateError);

  if (existing) {
    const { error } = await updateTransactionsByInvoiceId(existing.id, row);

    if (error) throw error;
  } else {
    const { error } = await insertBillingTransactions(row);

    if (error) throw mapSupabaseError(error);
  }
}

export async function onInvoicePaymentFailed(
  invoice: Stripe.Invoice,
): Promise<void> {
  const [collegeId, { paymentIntentId }] = await Promise.all([
    resolveCollegeIdFromInvoice(invoice),
    getInvoicePaymentIds(invoice.id),
  ]);

  const subscriptionId = getSubscriptionId(invoice);

  if (!subscriptionId) return;

  // See note in onInvoicePaid — same 2-decimal-currency assumption.
  const amountMinor = invoice.amount_due;

  const row = {
    college_id: collegeId,
    stripe_invoice_id: invoice.id,
    stripe_payment_intent_id: paymentIntentId,
    stripe_customer_id: extractId(invoice.customer),
    stripe_subscription_id: subscriptionId,
    amount: amountMinor / 100,
    amount_minor: amountMinor,
    currency: invoice.currency,
    status: "failed" as const,
    transaction_action: "charge",
    source_type: "subscription",
    failure_reason: `Payment attempt ${invoice.attempt_count} failed`,
  };

  const { error } = await insertBillingTransactions(row);

  if (error && error.code !== "23505") throw error;

  const supabase = createAdminClient();
  const { error: updateError } = await supabase
    .from("college_subscriptions")
    .update({
      latest_invoice_id: invoice.id,
      stripe_latest_invoice_number: invoice.number,
      latest_invoice_url: invoice.hosted_invoice_url ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", subscriptionId);

  if (updateError) throw mapSupabaseError(updateError);
}
