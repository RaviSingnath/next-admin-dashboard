"use server";

import { PlanList } from "@/components/stripe/plan-list";
import { getPlansService } from "@/features/stripe/service/stripe.services";
import { getAllSubscriptions } from "@/features/colleges/college.service";
import { getActiveSubscription } from "@/features/colleges/college.service";
import { ActiveSubscription } from "./_components/active-subscription/active-subscription";

export default async function PlansPage() {
  const plans = await getPlansService();
  const activeSubscription = await getActiveSubscription();
  const allSubscriptions = await getAllSubscriptions();

  if (!plans) return;

  return (
    <>
      {activeSubscription?.id ? (
        <ActiveSubscription
          subscription={activeSubscription}
          subscriptions={allSubscriptions}
        />
      ) : (
        <PlanList plans={plans} />
      )}
    </>
  );
}
