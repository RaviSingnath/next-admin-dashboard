import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe/client";
import { createAdminClient } from "@/lib/supabase/admin"; // your existing pattern
import {
  onSubscriptionCreated,
  onSubscriptionDeleted,
  onSubscriptionUpdated,
} from "@/features/stripe/service/stripe.subscription.service";
import {
  onInvoicePaid,
  onInvoicePaymentFailed,
} from "@/features/stripe/service/stripe.invoice.service";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // 1. Read raw body — MUST be raw bytes, not parsed JSON.
  //    Next.js App Router gives you the raw body via req.text() / req.arrayBuffer().
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 },
    );
  }

  // 2. Verify the webhook signature.
  //    This proves the request genuinely came from Stripe, not a spoofed caller.
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createAdminClient(); // service_role — bypasses RLS

  // 3. Persist the raw event before processing.
  //    If the handler crashes, the event is still in the DB and can be reprocessed.
  //    The unique constraint on stripe_event_id handles duplicate Stripe deliveries.
  const { data: webhookRow, error: insertError } = await supabase
    .from("stripe_webhook_events")
    .insert({
      stripe_event_id: event.id,
      event_type: event.type,
      livemode: event.livemode,
      api_version: event.api_version ?? null,
      payload: JSON.parse(JSON.stringify(event)),
      processed: false,
      attempt_count: 1,
      // Set a 90-day TTL — the CRON job will clean this up
      expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    })
    .select("id")
    .single();

  // Duplicate event — Stripe re-delivered something we already processed. Return 200
  // so Stripe stops retrying. Do NOT return 4xx here.
  if (insertError?.code === "23505") {
    return NextResponse.json({ received: true, duplicate: true });
  }

  if (insertError || !webhookRow) {
    console.error("Failed to persist webhook event:", insertError);
    // Return 500 so Stripe retries delivery
    return NextResponse.json(
      { error: "Failed to store event" },
      { status: 500 },
    );
  }

  // 4. Acquire a distributed lock so only one worker processes this event
  //    (relevant when you have multiple serverless instances running concurrently).
  const workerId = crypto.randomUUID();
  const { count } = await supabase
    .from("stripe_webhook_events")
    .update({
      locked_by: workerId,
      processing_started_at: new Date().toISOString(),
    })
    .eq("id", webhookRow.id)
    .is("locked_by", null) // only claim if not already locked
    .eq("processed", false);

  if (count === 0) {
    // Another instance claimed this event first — skip processing
    return NextResponse.json({ received: true, skipped: true });
  }

  // 5. Route to the appropriate handler
  try {
    await handleStripeEvent(event);

    // 6. Mark as successfully processed
    await supabase
      .from("stripe_webhook_events")
      .update({
        processed: true,
        processed_at: new Date().toISOString(),
        processing_completed_at: new Date().toISOString(),
      })
      .eq("id", webhookRow.id);
  } catch (err) {
    // Log the error but return 200 anyway — we've stored the event and can
    // manually reprocess it. Returning 500 here causes Stripe to re-deliver,
    // which is only appropriate if the error is transient (network, DB down).
    console.error(`Handler failed for ${event.type}:`, err);

    await supabase
      .from("stripe_webhook_events")
      .update({
        processing_error: err instanceof Error ? err.message : String(err),
        locked_by: null, // release the lock so retry logic can reclaim it
      })
      .eq("id", webhookRow.id);
  }

  // Always return 200 to Stripe — anything else triggers re-delivery
  return NextResponse.json({ received: true });
}

// Route events to handler functions as you build them out
async function handleStripeEvent(event: Stripe.Event) {
  switch (event.type) {
    case "customer.subscription.created":
      await onSubscriptionCreated(event.data.object as Stripe.Subscription);
      break;

    case "customer.subscription.updated":
      await onSubscriptionUpdated(event.data.object as Stripe.Subscription);
      break;

    case "customer.subscription.deleted":
      await onSubscriptionDeleted(event.data.object as Stripe.Subscription);
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
