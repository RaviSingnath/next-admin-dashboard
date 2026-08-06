"use server";

import { PlanList } from "@/components/stripe/plan-list";
import {
  getCollegeSubscription,
  getPlansService,
} from "@/features/stripe/service/stripe.services";
import { ActiveSubscription } from "./_components/active-subscription/active-subscription";
import PageWrapperTitle from "@/components/layout/page-wrapper-title";

export default async function PlansPage() {
  const plans = await getPlansService();
  const subscription = await getCollegeSubscription();

  console.log(subscription);

  if (!plans) return;

  return (
    // <PageWrapperTitle title="Subscription">
    <>
      {subscription?.id ? (
        <ActiveSubscription subscription={subscription} />
      ) : (
        <PlanList plans={plans} />
      )}
    </>
    // </PageWrapperTitle>
  );
}
