"use client";

import { SubscriptionPlan } from "@/features/stripe/stripe.queries";
import PricingPlanCard from "@/features/plan/components/pricing-plan-card";
import { useAuth } from "@/context/AuthProvider";

type PlanPricingFormProps = {
  plans: SubscriptionPlan[];
};

export function PlanList({ plans }: PlanPricingFormProps) {
  const { user } = useAuth();

  return (
    <div className="flex items-start justify-center gap-6">
      {plans?.map((plan) => (
        <PricingPlanCard
          key={plan.id}
          plan={plan}
          activeSubscripton={user?.subscription_plan_id}
        />
      ))}
    </div>
  );
}
