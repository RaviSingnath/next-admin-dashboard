"use server";

import { PlanPricingForm } from "@/components/stripe/pricing-form";
import {
  getCollegeSubscription,
  getPlansService,
} from "@/features/stripe/service/stripe.services";

export default async function PlansPage() {
  const plans = await getPlansService();
  const subscription = await getCollegeSubscription();

  return (
    <div>
      {plans?.map((plan) => (
        <PlanPricingForm key={plan.id} plan={plan} />
      ))}
    </div>
  );
}
