"use client";

import { useForm } from "react-hook-form";
import { redirect } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import Button from "@/components/ui/button/Button";
import { Plan } from "@/features/stripe/service/stripe.services";
import { TPlan, zPlan } from "@/features/stripe/stripe.schema";
import { createCheckoutSession } from "@/features/stripe/stripe.action";
import { ActionGuard } from "@/lib/rbac/guard/ActionGuard";
import { Permission } from "@/lib/rbac/permissions";
import EditPlanButton from "./edit-plan-button";

type PricingPlancardProps = {
  plan: Plan;
  payInterval: string;
  activeSubscripton: string | null;
};

export default function PricingPlanCard({
  plan,
  payInterval,
  activeSubscripton,
}: PricingPlancardProps) {
  const form = useForm<TPlan>({
    resolver: zodResolver(zPlan),
    defaultValues: {
      planId: payInterval === "monthly" ? plan.monthly.id : plan.yearly.id,
    },
  });

  async function onSubmit(data: TPlan) {
    const { url } = await createCheckoutSession(data);
    redirect(url);
  }

  return (
    <div
      data-featured={activeSubscripton === plan.id}
      className="group/tier data-[featured=true]:ring-brand-600 rounded-3xl bg-white p-4 ring-2 ring-gray-200 xl:p-5 dark:bg-white/[0.03] dark:ring-gray-800"
    >
      <p className="text-xs/6 text-gray-600 dark:text-gray-300">
        A plan that scales with your rapidly growing business.
      </p>
      <div className="relative flex items-center justify-between gap-x-4">
        <h3
          id="tier-tier-startup"
          className="group-data-[featured=true]/tier:text-brand-600 dark:group-data-[featured=true]/tier:text-brand-400 text-lg/8 font-semibold text-gray-900 dark:text-white"
        >
          {plan.name}
        </h3>

        <p className="bg-brand-600/10 text-brand-600 dark:bg-brand-500 rounded-full px-2.5 py-1 text-xs/5 font-semibold group-[:not([data-featured=true])]/tier:hidden dark:text-white">
          Active
        </p>
      </div>

      <ul
        role="list"
        className="mt-2 space-y-0 text-xs/6 text-gray-600 dark:text-gray-300"
      >
        {plan.features?.map((feature) => (
          <li key={feature.id} className="flex gap-x-3">
            <Check className="text-brand-600 dark:text-brand-400 h-6 w-5 flex-none" />

            {feature.feature}
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between">
        <p className="mt-2 flex items-baseline gap-x-1 group-[:not(:has([name=frequency][value=monthly]:checked))]/tiers:hidden">
          <span className="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">
            $
            {payInterval === "monthly"
              ? plan.monthly.amount
              : plan.yearly.amount}
          </span>
          <span className="text-sm/6 font-semibold text-gray-600 dark:text-gray-400">
            /
            {payInterval === "monthly"
              ? plan.monthly.interval
              : plan.yearly.interval}
          </span>
        </p>

        <ActionGuard permission={Permission.SUBSCRIBE_PLAN}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <input
              type="hidden"
              {...form.register("planId")}
              value={
                payInterval === "monthly" ? plan.monthly.id : plan.yearly.id
              }
              name="planId"
            />
            <Button
              type="submit"
              className="mt-6 w-full px-3 py-2 text-center text-sm/6 font-semibold"
            >
              Subscribe
            </Button>
          </form>
        </ActionGuard>

        <ActionGuard permission={Permission.UPDATE_PLAN}>
          <EditPlanButton plan={plan} />
        </ActionGuard>
      </div>
    </div>
  );
}
