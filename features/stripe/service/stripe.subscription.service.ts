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

// Builds the shared upsert/update payload from a Stripe Subscription object.
// Used by both onCreate and onUpdate to avoid field drift between the two.
function buildSubscriptionPayload(subscription: Stripe.Subscription) {
  const item = subscription.items.data[0];
  return {
    status: subscription.status,
    current_period_start: toIso(item?.current_period_start ?? null),
    current_period_end: toIso(item?.current_period_end ?? null),
    cancel_at_period_end: subscription.cancel_at_period_end,
    cancel_reason: subscription.cancellation_details?.reason ?? null,
    canceled_at: toIso(subscription.canceled_at),
    trial_start: toIso(subscription.trial_start),
    trial_end: toIso(subscription.trial_end),
  };
}

// ── Service methods ───────────────────────────────────────────────────────────

export async function onSubscriptionCreated(
  subscription: Stripe.Subscription,
): Promise<void> {
  const supabase = createAdminClient();

  const collegeId = subscription.metadata?.college_id;
  if (!collegeId) {
    throw new Error(
      `Missing college_id in subscription metadata: ${subscription.id}`,
    );
  }

  const priceId = subscription.items.data[0]?.price.id;
  if (!priceId) {
    throw new Error(`No price on subscription: ${subscription.id}`);
  }

  const planId = await resolvePlanId(priceId, supabase);

  const { error } = await supabase.from("college_subscriptions").upsert(
    {
      college_id: collegeId,
      plan_id: planId,
      stripe_customer_id: extractId(subscription.customer)!,
      stripe_subscription_id: subscription.id,
      ...buildSubscriptionPayload(subscription),
    },
    { onConflict: "stripe_subscription_id" },
  );

  if (error) throw error;
}

export async function onSubscriptionUpdated(
  subscription: Stripe.Subscription,
): Promise<void> {
  const supabase = createAdminClient();

  const priceId = subscription.items.data[0]?.price.id;
  if (!priceId) {
    throw new Error(`No price on subscription: ${subscription.id}`);
  }

  const planId = await resolvePlanId(priceId, supabase);

  const { error } = await supabase
    .from("college_subscriptions")
    .update({
      plan_id: planId,
      ...buildSubscriptionPayload(subscription),
    })
    .eq("stripe_subscription_id", subscription.id);

  if (error) throw error;
}

export async function onSubscriptionDeleted(
  subscription: Stripe.Subscription,
): Promise<void> {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("college_subscriptions")
    .update({
      status: "canceled",
      canceled_at: toIso(subscription.canceled_at) ?? new Date().toISOString(),
      cancel_at_period_end: false,
    })
    .eq("stripe_subscription_id", subscription.id);

  if (error) throw error;
}
