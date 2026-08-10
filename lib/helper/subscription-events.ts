import { createAdminClient } from "@/lib/supabase/admin";
import {
  SUBSCRIPTION_EVENT_TYPES,
  type SubscriptionEventType,
} from "../constants/subscription-event-types";

interface RecordSubscriptionEventInput {
  collegeId: string;
  eventType: SubscriptionEventType;
  fromPlanId?: string | null;
  toPlanId?: string | null;
  /** ISO timestamp. Defaults to now() — pass the Stripe event's own
   *  created time when you have it, so the timeline reflects when the
   *  change actually happened rather than when we got around to logging it. */
  occurredAt?: string;
}

/**
 * Deliberately does NOT throw on failure. This table is an audit trail for
 * the UI, not part of the subscription sync's correctness — a bug here
 * shouldn't cause Stripe to see a non-2xx response and retry an otherwise-
 * successful webhook forever. Failures are logged loudly instead so
 * they're visible without being fatal.
 */
export async function recordSubscriptionEvent(
  supabase: ReturnType<typeof createAdminClient>,
  input: RecordSubscriptionEventInput,
): Promise<void> {
  const { error } = await supabase.from("college_subscription_events").insert({
    college_id: input.collegeId,
    event_type: input.eventType,
    from_plan_id: input.fromPlanId ?? null,
    to_plan_id: input.toPlanId ?? null,
    occurred_at: input.occurredAt ?? new Date().toISOString(),
  });

  if (error) {
    console.error(
      `[subscription-events] Failed to record ${input.eventType} for college ${input.collegeId}:`,
      error,
    );
  }
}

/**
 * Compares two plans' prices to determine upgrade vs. downgrade direction.
 * Deliberately compares price, not plan name/tier order — plan names
 * sorting alphabetically or by creation order says nothing about which is
 * actually more expensive.
 *
 * NOTE: assumes a `price` column on subscription_plans. Adjust the
 * `.select()` / comparison below if your column is named differently
 * (e.g. price_minor, monthly_price).
 */
export async function resolvePlanChangeDirection(
  supabase: ReturnType<typeof createAdminClient>,
  fromPlanId: string,
  toPlanId: string,
): Promise<"upgraded" | "downgraded" | null> {
  const { data: plans, error } = await supabase
    .from("subscription_plans")
    .select("id, amount")
    .in("id", [fromPlanId, toPlanId]);

  if (error) throw error;

  const fromPlan = plans?.find((p) => p.id === fromPlanId);
  const toPlan = plans?.find((p) => p.id === toPlanId);

  // Don't crash the whole subscription sync just because a plan diff
  // couldn't be resolved (e.g. a plan was deleted) — skip the timeline
  // event rather than throwing.
  if (!fromPlan || !toPlan) return null;
  if (toPlan.amount === fromPlan.amount) return null; // e.g. billing-cycle-only change

  return toPlan.amount > fromPlan.amount ? "upgraded" : "downgraded";
}

export { SUBSCRIPTION_EVENT_TYPES };
