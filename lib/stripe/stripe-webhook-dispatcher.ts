import Stripe from "stripe";
import {
  onSubscriptionCreated,
  onSubscriptionUpdated,
  onSubscriptionDeleted,
} from "@/features/stripe/service/stripe.subscription.service";
import {
  onInvoicePaid,
  onInvoicePaymentFailed,
} from "@/features/stripe/service/stripe.invoice.service";

export async function handleStripeEvent(event: Stripe.Event) {
  switch (event.type) {
    case "customer.subscription.created":
      await onSubscriptionCreated(
        event.data.object as Stripe.Subscription,
        event.created,
      );
      break;

    case "customer.subscription.updated":
      await onSubscriptionUpdated(
        event.data.object as Stripe.Subscription,
        event.created,
      );
      break;

    case "customer.subscription.deleted":
      await onSubscriptionDeleted(
        event.data.object as Stripe.Subscription,
        event.created,
      );
      break;

    case "invoice.paid":
      await onInvoicePaid(event.data.object as Stripe.Invoice);
      break;

    case "invoice.payment_failed":
      await onInvoicePaymentFailed(event.data.object as Stripe.Invoice);
      break;

    default:
      console.log(`[webhook] Unhandled event type: ${event.type}`);
  }
}
