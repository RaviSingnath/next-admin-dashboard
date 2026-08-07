import Stripe from "stripe";
import { randomUUID } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { handleStripeEvent } from "./stripe-webhook-dispatcher";

/**
 * Wraps the existing event-type switch (handleStripeEvent) with lease-based
 * idempotency via stripe_webhook_events.
 *
 * This is the function your route handler should call — NOT
 * handleStripeEvent directly. handleStripeEvent stays unchanged; it doesn't
 * need to know about leasing.
 *
 * Flow:
 *   1. Try to claim the event (insert-or-reclaim, guarded by lease expiry).
 *   2. If not claimed → already processed or another invocation is actively
 *      handling it. Return quietly with 2xx so Stripe doesn't retry.
 *   3. If claimed → run the real handler. On success, mark complete. On
 *      error, release the lease + record the error, then rethrow so your
 *      route handler can return a non-2xx and let Stripe retry.
 */
export async function handleStripeEventWithLease(
  event: Stripe.Event,
): Promise<void> {
  const supabase = createAdminClient();

  // Unique per invocation (not per event) — this is what lets
  // complete_stripe_event/fail_stripe_event tell "am I still the worker
  // holding this lease" apart from a reclaim that happened after my lease
  // expired.
  const lockedBy = randomUUID();

  const { data, error: claimError } = await supabase.rpc("claim_stripe_event", {
    p_stripe_event_id: event.id,
    p_event_type: event.type,
    p_livemode: event.livemode,
    // Generated RPC type is `string`, not `string | null` — Supabase's
    // type generator doesn't carry Postgres nullability through for
    // required params, even though the column itself is nullable.
    p_api_version: event.api_version ?? "",
    // JSON.parse(JSON.stringify(...)) returns `any`, which satisfies the
    // recursive `Json` union without a structural cast fight, and as a
    // side effect guarantees the payload is actually JSON-safe.
    p_payload: JSON.parse(JSON.stringify(event)),
    p_locked_by: lockedBy,
    p_lease_seconds: 60,
  });

  if (claimError) throw claimError;

  // claim_stripe_event's generated Returns type is `string`, but the SQL
  // function returns NULL (uuid) whenever the event isn't claimed — that's
  // the entire signal this wrapper depends on. Postgres doesn't surface
  // function-return nullability to the type generator, so we cast
  // explicitly instead of trusting `string` here. Don't let a future
  // "this is always a string" cleanup delete the check below.
  const claimedId = data as string | null;

  if (!claimedId) {
    console.log(
      `[webhook] Skipping event ${event.id} (${event.type}) — already ` +
        `processed or currently held by another invocation`,
    );
    return;
  }

  try {
    await handleStripeEvent(event);

    const { data: completed, error: completeError } = await supabase.rpc(
      "complete_stripe_event",
      { p_stripe_event_id: event.id, p_locked_by: lockedBy },
    );

    if (completeError) throw completeError;

    if (!completed) {
      // Our lease expired mid-processing and someone else reclaimed the
      // event before we finished. Our work still ran, but we can no longer
      // safely mark it complete under our own lease — log it for visibility
      // rather than silently succeeding.
      console.warn(
        `[webhook] Processed event ${event.id} but lease was reclaimed ` +
          `before completion — check for slow handlers vs. lease duration`,
      );
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);

    const { error: failError } = await supabase.rpc("fail_stripe_event", {
      p_stripe_event_id: event.id,
      p_locked_by: lockedBy,
      p_error: message,
    });

    if (failError) {
      console.error(
        `[webhook] Failed to record failure for event ${event.id}:`,
        failError,
      );
    }

    throw err; // propagate so the route returns non-2xx and Stripe retries
  }
}
