type PlanPricingFormProps = {
  plans: SubscriptionPlan[];
};

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SubscriptionPlan } from "@/features/stripe/stripe.queries";
import { PlanPricingForm } from "./pricing-form";
import EditPlanButton from "@/features/plan/components/edit-plan-button";
import { Permission } from "@/lib/rbac/permissions";
import { ActionGuard } from "@/lib/rbac/guard/ActionGuard";

export function PlanList({ plans }: PlanPricingFormProps) {
  return (
    <div className="flex items-center justify-center gap-6">
      {plans?.map((plan) => (
        <Card key={plan.id} className="w-full sm:max-w-md">
          <CardHeader>
            <div className="relative">
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <ActionGuard permission={Permission.UPDATE_PLAN}>
                <EditPlanButton plan={plan} />
              </ActionGuard>
            </div>
            <CardDescription>
              <div className="flex items-center gap-1">
                <span className="text-xl uppercase self-end">
                  {plan.currency}
                </span>
                <span className="text-3xl font-semibold">{plan.amount}</span>
              </div>

              <span>per {plan.interval}</span>
            </CardDescription>
          </CardHeader>
          <ActionGuard permission={Permission.SUBSCRIBE_PLAN}>
            <PlanPricingForm plan={plan} />
          </ActionGuard>
        </Card>
      ))}
    </div>
  );
}
