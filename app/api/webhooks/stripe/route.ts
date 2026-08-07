import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/client";
import { handleStripeEventWithLease } from "@/lib/stripe/stripe-webhook-lease";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error("[webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    // Was: await handleStripeEvent(event)
    // Now goes through the lease wrapper first, which dedupes/locks before
    // delegating to the same handleStripeEvent switch as before.
    await handleStripeEventWithLease(event);
  } catch (err) {
    console.error(`[webhook] Failed to process event ${event.id}:`, err);
    // Non-2xx tells Stripe to retry — fail_stripe_event already released
    // the lease so the retry can be claimed.
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
