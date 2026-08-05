"use client";

import { type Plans } from "@/features/stripe/service/stripe.services";
import PricingPlanCard from "@/features/plan/components/pricing-plan-card";
import { useAuth } from "@/context/AuthProvider";
import { useState } from "react";
import ButtonGroup from "../common/button-group";

type PlanPricingFormProps = {
  plans: Plans;
};

export function PlanList({ plans }: PlanPricingFormProps) {
  const { user } = useAuth();
  const [payInterval, setPayInterval] = useState("monthly");
  console.log(plans);

  const handleToggle = (interval: string) => {
    setPayInterval(interval);
  };
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <ButtonGroup onChange={handleToggle} payInterval={payInterval} />
      <div className="flex flex-col sm:flex-row items-start justify-center gap-6">
        {plans.map((plan) => (
          <PricingPlanCard
            key={plan.id}
            plan={plan}
            payInterval={payInterval}
            activeSubscripton={user?.subscription_plan_id}
          />
        ))}
      </div>
    </div>
  );
}
