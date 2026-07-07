"use server";

import { stripe } from "@/lib/stripe/client";
import { createAdminClient } from "@/lib/supabase/admin";

export async function cancelSubscription(
  collegeId: string,
  reason?: string,
): Promise<void> {
  const supabase = createAdminClient();

  const { data: subscription, error } = await supabase
    .from("college_subscriptions")
    .select("stripe_subscription_id, cancel_at_period_end")
    .eq("college_id", collegeId)
    .in("status", ["active", "trialing"])
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!subscription) throw new Error("No active subscription found");
  if (subscription.cancel_at_period_end) {
    throw new Error("Subscription is already scheduled for cancellation");
  }

  // Tell Stripe to cancel at period end, not immediately
  await stripe.subscriptions.update(subscription.stripe_subscription_id, {
    cancel_at_period_end: true,
    ...(reason && {
      cancellation_details: { comment: reason },
    }),
  });

  // Optimistic update — webhook confirms asynchronously
  const { error: updateError } = await supabase
    .from("college_subscriptions")
    .update({
      cancel_at_period_end: true,
      cancel_reason: reason ?? null,
    })
    .eq("stripe_subscription_id", subscription.stripe_subscription_id);

  if (updateError) throw new Error(updateError.message);
}
