"use server";

import { stripe } from "@/lib/stripe/client";
import { createAdminClient } from "@/lib/supabase/admin";

export async function changePlan(
  collegeId: string,
  newPlanId: string,
): Promise<void> {
  const supabase = createAdminClient();

  // Fetch both the current subscription and the target plan in parallel
  const [subscriptionResult, planResult] = await Promise.all([
    supabase
      .from("college_subscriptions")
      .select("stripe_subscription_id, plan_id")
      .eq("college_id", collegeId)
      .in("status", ["active", "trialing"])
      .maybeSingle(),

    supabase
      .from("subscription_plans")
      .select("id, stripe_price_id, active")
      .eq("id", newPlanId)
      .maybeSingle(),
  ]);

  if (subscriptionResult.error)
    throw new Error(subscriptionResult.error.message);
  if (planResult.error) throw new Error(planResult.error.message);

  const subscription = subscriptionResult.data;
  const newPlan = planResult.data;

  if (!subscription) throw new Error("No active subscription found");
  if (!newPlan?.active) throw new Error("Target plan not found or inactive");
  if (subscription.plan_id === newPlanId) {
    throw new Error("College is already on this plan");
  }

  // Retrieve the Stripe subscription to get the current item ID.
  // The item ID is required by the Stripe API to specify which item to update.
  // current_period_start/end are now on the item (2025-03-31.basil+).
  const stripeSubscription = await stripe.subscriptions.retrieve(
    subscription.stripe_subscription_id,
  );

  const currentItem = stripeSubscription.items.data[0];
  if (!currentItem) {
    throw new Error("No subscription item found on Stripe subscription");
  }

  // create_prorations: Stripe calculates the prorated amount and adds it
  // to the next invoice. The college is charged/credited the difference.
  await stripe.subscriptions.update(subscription.stripe_subscription_id, {
    items: [
      {
        id: currentItem.id,
        price: newPlan.stripe_price_id,
      },
    ],
    proration_behavior: "create_prorations",
  });

  // No optimistic DB update here — the plan_id change is non-trivial to
  // replicate locally. onSubscriptionUpdated resolves it correctly from the
  // webhook payload within seconds.
}
