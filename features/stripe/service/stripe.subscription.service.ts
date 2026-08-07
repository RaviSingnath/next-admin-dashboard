import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { toIso, extractId } from "@/lib/stripe/helpers";

// ── Shared helpers ────────────────────────────────────────────────────────────

// Resolves the internal plan UUID from a Stripe Price ID.
// Throws if the price has no matching plan — catches misconfigured plans early.
async function resolvePlanId(
  priceId: string,
  supabase: ReturnType<typeof createAdminClient>,
): Promise<string> {
  const { data: plan, error } = await supabase
    .from("subscription_plans")
    .select("id")
    .eq("stripe_price_id", priceId)
    .maybeSingle();

  if (error) throw error;
  if (!plan) throw new Error(`No plan found for stripe_price_id: ${priceId}`);

  return plan.id;
}

/** current_period_start/end live on the subscription item, not the subscription itself */
function extractPeriod(subscription: Stripe.Subscription) {
  const item = subscription.items.data[0];
  return {
    current_period_start: toIso(item?.current_period_start),
    current_period_end: toIso(item?.current_period_end),
  };
}

// Builds the shared insert/update payload from a Stripe Subscription object.
// Used by the single upsert path below so create/update never drift apart.
// eventCreatedAt is stripe_event_created_at — the ordering guard that lets
// upsertSubscriptionFromStripe refuse to overwrite a newer state with an
// older one when webhooks arrive out of order.
function buildSubscriptionPayload(
  subscription: Stripe.Subscription,
  planId: string,
  eventCreatedAt: number,
) {
  const period = extractPeriod(subscription);

  return {
    plan_id: planId,
    status: subscription.status,
    current_period_start: period.current_period_start,
    current_period_end: period.current_period_end,
    cancel_at_period_end: subscription.cancel_at_period_end,
    cancel_reason: subscription.cancellation_details?.reason ?? null,
    canceled_at: toIso(subscription.canceled_at),
    trial_start: toIso(subscription.trial_start),
    trial_end: toIso(subscription.trial_end),
    stripe_event_created_at: eventCreatedAt,
    updated_at: new Date().toISOString(),
  };
}

// ── Core: order-independent upsert ────────────────────────────────────────────

/**
 * Shared path for `customer.subscription.created` and `.updated`.
 *
 * Merging them removes two races that existed when they were handled
 * separately:
 *   1. `updated` arriving before `created` — a plain UPDATE would silently
 *      no-op (0 rows affected, no error) because the row didn't exist yet.
 *   2. `created` arriving after a newer `updated` — an unconditional upsert
 *      would overwrite fresher state with stale state.
 *
 * We always read-then-decide whether to insert or update, and skip writes
 * older than what's already stored (stripe_event_created_at).
 */
async function upsertSubscriptionFromStripe(
  subscription: Stripe.Subscription,
  eventCreatedAt: number,
): Promise<void> {
  const supabase = createAdminClient();

  const priceId = subscription.items.data[0]?.price.id;
  if (!priceId) {
    throw new Error(`No price on subscription: ${subscription.id}`);
  }
  const planId = await resolvePlanId(priceId, supabase);

  const { data: existing, error: fetchError } = await supabase
    .from("college_subscriptions")
    .select("id, stripe_event_created_at")
    .eq("stripe_subscription_id", subscription.id)
    .maybeSingle();

  if (fetchError) throw fetchError;

  const payload = buildSubscriptionPayload(
    subscription,
    planId,
    eventCreatedAt,
  );

  // Row doesn't exist yet — insert. Handles `updated` arriving before `created`.
  if (!existing) {
    const collegeId = subscription.metadata?.college_id;
    if (!collegeId) {
      throw new Error(
        `Missing college_id in subscription metadata: ${subscription.id}`,
      );
    }

    const { error } = await supabase.from("college_subscriptions").insert({
      college_id: collegeId,
      stripe_customer_id: extractId(subscription.customer)!,
      stripe_subscription_id: subscription.id,
      ...payload,
    });

    if (error) throw error;
    return;
  }

  // Row exists but this event is older than what's already stored — skip.
  // Handles `created` (or a retried/delayed event) arriving after a newer state.
  if (
    existing.stripe_event_created_at !== null &&
    existing.stripe_event_created_at >= eventCreatedAt
  ) {
    console.log(
      `[webhook] Skipping stale event for subscription ${subscription.id} ` +
        `(incoming=${eventCreatedAt}, stored=${existing.stripe_event_created_at})`,
    );
    return;
  }

  const { error } = await supabase
    .from("college_subscriptions")
    .update(payload)
    .eq("stripe_subscription_id", subscription.id);

  if (error) throw error;
}

// ── Service methods ───────────────────────────────────────────────────────────

export async function onSubscriptionCreated(
  subscription: Stripe.Subscription,
  eventCreatedAt: number,
): Promise<void> {
  await upsertSubscriptionFromStripe(subscription, eventCreatedAt);
}

export async function onSubscriptionUpdated(
  subscription: Stripe.Subscription,
  eventCreatedAt: number,
): Promise<void> {
  await upsertSubscriptionFromStripe(subscription, eventCreatedAt);
}

export async function onSubscriptionDeleted(
  subscription: Stripe.Subscription,
  eventCreatedAt: number,
): Promise<void> {
  const supabase = createAdminClient();

  const { data: existing, error: fetchError } = await supabase
    .from("college_subscriptions")
    .select("stripe_event_created_at")
    .eq("stripe_subscription_id", subscription.id)
    .maybeSingle();

  if (fetchError) throw fetchError;

  if (
    existing?.stripe_event_created_at != null &&
    existing.stripe_event_created_at >= eventCreatedAt
  ) {
    console.log(
      `[webhook] Skipping stale delete event for subscription ${subscription.id}`,
    );
    return;
  }

  const { error } = await supabase
    .from("college_subscriptions")
    .update({
      status: subscription.status, // "canceled", Stripe sets this to 'canceled'
      canceled_at: toIso(subscription.canceled_at) ?? new Date().toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end, // false
      cancel_reason: subscription.cancellation_details?.reason ?? null,
      ended_at: new Date().toISOString(),
      stripe_event_created_at: eventCreatedAt,
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", subscription.id);

  if (error) throw error;
}
