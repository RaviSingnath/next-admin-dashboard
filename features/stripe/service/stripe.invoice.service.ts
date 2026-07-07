import Stripe from "stripe";
import {
  extractId,
  getInvoicePaymentIds,
  resolveCollegeIdFromInvoice,
  toIso,
} from "@/lib/stripe/helpers";
import { getTransactionsByInvoiceId } from "../stripe.queries";
import {
  insertBillingTransactions,
  updateTransactionsByInvoiceId,
} from "../stripe.mutations";
import { Errors } from "@/lib/errors/error-factory";
import { mapSupabaseError } from "@/lib/errors/supabase-error";

// Extract the subscription ID from the new parent field structure.
// invoice.parent.type must be 'subscription_details' for subscription invoices.
function getSubscriptionId(invoice: Stripe.Invoice): string | null {
  if (invoice.parent?.type === "subscription_details") {
    return extractId(invoice.parent.subscription_details?.subscription) ?? null;
  }
  return null;
}

export async function onInvoicePaid(invoice: Stripe.Invoice): Promise<void> {
  const [collegeId, { paymentIntentId, chargeId }] = await Promise.all([
    resolveCollegeIdFromInvoice(invoice),
    getInvoicePaymentIds(invoice.id),
  ]);

  if (!collegeId) {
    throw Errors.collegeNotAssigned();
  }

  const amountMinor = invoice.amount_paid;

  const row = {
    college_id: collegeId,
    stripe_invoice_id: invoice.id,
    stripe_payment_intent_id: paymentIntentId,
    stripe_charge_id: chargeId,
    stripe_customer_id: extractId(invoice.customer),
    stripe_subscription_id: getSubscriptionId(invoice),
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

  const amountMinor = invoice.amount_due;

  const row = {
    college_id: collegeId,
    stripe_invoice_id: invoice.id,
    stripe_payment_intent_id: paymentIntentId,
    stripe_customer_id: extractId(invoice.customer),
    stripe_subscription_id: getSubscriptionId(invoice),
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
}
