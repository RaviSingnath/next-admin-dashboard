import {
  getCollegeByCustomerId,
  getSubscriptionBySubscriptionId,
} from "@/features/stripe/stripe.queries";
import Stripe from "stripe";
import { stripe } from "./client";
import { Errors } from "../errors/error-factory";

// Stripe returns timestamps as Unix seconds. Convert to ISO for Postgres.
export function toIso(ts: number | null | undefined): string | null {
  return ts ? new Date(ts * 1000).toISOString() : null;
}

// Stripe expanded fields can be either the raw ID string or the full object.
// Always extract just the string ID.
export function extractId(
  field: string | { id: string } | null | undefined,
): string | null {
  if (!field) return null;
  return typeof field === "string" ? field : field.id;
}

// Helper to extract the Stripe Subscription ID from an invoice
// using the new parent field structure (2025-03-31.basil+).
function extractSubscriptionIdFromInvoice(
  invoice: Stripe.Invoice,
): string | null {
  if (invoice.parent?.type === "subscription_details") {
    return extractId(invoice.parent.subscription_details?.subscription) ?? null;
  }
  return null;
}

// Fetches the PaymentIntent ID and Charge ID for an invoice
// using the new InvoicePayment object (2025-03-31.basil+).
//
// Why a separate API call:
//   invoice.payment_intent and invoice.charge were removed from the Invoice
//   root object. The InvoicePayment object is now the only way to access
//   the payment details linked to an invoice.
//
// Why limit: 1:
//   College Diary uses standard Stripe subscriptions with automatic payment
//   collection. Each invoice has exactly one PaymentIntent. Partial payments
//   (multiple PaymentIntents per invoice) are not supported in this integration.
export async function getInvoicePaymentIds(invoiceId: string): Promise<{
  paymentIntentId: string | null;
  chargeId: string | null;
}> {
  // InvoicePayment is a top-level resource — GET /v1/invoice_payments?invoice=in_xxx
  // Not a sub-resource of invoices. stripe.invoices.listPayments() does not exist.
  const payments = await stripe.invoicePayments.list({
    invoice: invoiceId,
    limit: 1,
  });

  const invoicePayment = payments.data[0];
  if (!invoicePayment) {
    return { paymentIntentId: null, chargeId: null };
  }

  const paymentIntentId =
    invoicePayment.payment?.type === "payment_intent"
      ? extractId(invoicePayment.payment.payment_intent)
      : null;

  let chargeId: string | null = null;
  if (paymentIntentId) {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    chargeId = extractId(paymentIntent.latest_charge);
  }

  return { paymentIntentId, chargeId };
}

export async function resolveCollegeIdFromInvoice(
  invoice: Stripe.Invoice,
): Promise<string> {
  // ── Path 1: subscription metadata (fastest, race-condition-proof) ─────────
  // college_id is stamped into subscription_data.metadata in createCheckoutSession.
  // Stripe copies it to invoice.parent.subscription_details.metadata.
  // This path works even if college_subscriptions doesn't exist yet.
  if (invoice.parent?.type === "subscription_details") {
    const collegeId = invoice.parent.subscription_details?.metadata?.college_id;
    if (collegeId) return collegeId;
  }

  // ── Path 2: college_subscriptions row (handles renewals and plan changes) ──
  // Reliable after the initial subscription.created event has been processed.
  // Safe for all subsequent invoices (renewals, upgrades) where the row exists.
  const subscriptionId =
    invoice.parent?.type === "subscription_details"
      ? extractId(invoice.parent.subscription_details?.subscription)
      : null;

  if (!subscriptionId) {
    throw Errors.notFound("Subscription id not found");
  }

  const { data } = await getSubscriptionBySubscriptionId(subscriptionId);

  if (data?.college_id) return data.college_id;

  // ── Path 3: colleges.stripe_customer_id (last resort) ─────────────────────
  // Fallback for edge cases: non-subscription invoices, manual invoices,
  // or if the subscription row is missing for an unexpected reason.
  const customerId = extractId(invoice.customer);

  if (!customerId) {
    throw Errors.notFound("Customer id not found");
  }

  const { data: college } = await getCollegeByCustomerId(customerId);

  if (college?.id) return college.id;

  throw new Error(`Cannot resolve college_id for invoice: ${invoice.id}`);
}
