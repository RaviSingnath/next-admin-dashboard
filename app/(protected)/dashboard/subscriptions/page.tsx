"use server";

import { PlanList } from "@/components/stripe/plan-list";
import {
  getCollegeSubscription,
  getPlansService,
  getRecentSubscriptions,
} from "@/features/stripe/service/stripe.services";
import { ActiveSubscription } from "./_components/active-subscription/active-subscription";

export default async function PlansPage() {
  const plans = await getPlansService();
  const subscription = await getCollegeSubscription();
  const subscriptions = await getRecentSubscriptions();

  console.log(subscription);

  if (!plans) return;

  return (
    <>
      {subscription?.id ? (
        <ActiveSubscription
          subscription={subscription}
          subscriptions={subscriptions}
        />
      ) : (
        <PlanList plans={plans} />
      )}
    </>
  );
}
