"use server";

import { stripe } from "@/lib/stripe/client";
import { createAdminClient } from "@/lib/supabase/admin";

export async function reactivateSubscription(collegeId: string): Promise<void> {
  const supabase = createAdminClient();

  const { data: subscription, error } = await supabase
    .from("college_subscriptions")
    .select("stripe_subscription_id, cancel_at_period_end")
    .eq("college_id", collegeId)
    .in("status", ["active", "trialing"])
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!subscription) throw new Error("No active subscription found");
  if (!subscription.cancel_at_period_end) {
    throw new Error("Subscription is not scheduled for cancellation");
  }

  await stripe.subscriptions.update(subscription.stripe_subscription_id, {
    cancel_at_period_end: false,
  });

  // Optimistic update — webhook confirms asynchronously
  const { error: updateError } = await supabase
    .from("college_subscriptions")
    .update({
      cancel_at_period_end: false,
      cancel_reason: null,
    })
    .eq("stripe_subscription_id", subscription.stripe_subscription_id);

  if (updateError) throw new Error(updateError.message);
}
