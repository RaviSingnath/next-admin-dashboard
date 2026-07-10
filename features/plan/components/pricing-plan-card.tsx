"use client";

import { useForm } from "react-hook-form";
import { redirect } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import Button from "@/components/ui/button/Button";
import { SubscriptionPlan } from "@/features/stripe/stripe.queries";
import { TPlan, zPlan } from "@/features/stripe/stripe.schema";
import { createCheckoutSession } from "@/features/stripe/stripe.action";
import { ActionGuard } from "@/lib/rbac/guard/ActionGuard";
import { Permission } from "@/lib/rbac/permissions";
import EditPlanButton from "./edit-plan-button";

type PricingPlancardProps = {
  plan: SubscriptionPlan;
  activeSubscripton: string | null;
};

export default function PricingPlanCard({
  plan,
  activeSubscripton,
}: PricingPlancardProps) {
  const form = useForm<TPlan>({
    resolver: zodResolver(zPlan),
    defaultValues: {
      planId: plan.id,
    },
  });

  async function onSubmit(data: TPlan) {
    const { url } = await createCheckoutSession(data);
    redirect(url);
  }

  return (
    <div
      data-featured={activeSubscripton === plan.id}
      className="group/tier rounded-3xl p-8 ring-2 ring-gray-200 data-[featured=true]:ring-brand-600 bg-white dark:ring-gray-800 dark:bg-white/[0.03] xl:p-10"
    >
      <div className="flex items-center justify-between gap-x-4 relative">
        <h3
          id="tier-tier-startup"
          className="text-lg/8 font-semibold text-gray-900 group-data-[featured=true]/tier:text-brand-600 dark:text-white dark:group-data-[featured=true]/tier:text-brand-400"
        >
          {plan.name}
        </h3>
        <ActionGuard permission={Permission.UPDATE_PLAN}>
          <EditPlanButton plan={plan} />
        </ActionGuard>
        <p className="rounded-full bg-brand-600/10 px-2.5 py-1 text-xs/5 font-semibold text-brand-600 group-[:not([data-featured=true])]/tier:hidden dark:bg-brand-500 dark:text-white">
          Active
        </p>
      </div>
      <p className="mt-4 text-sm/6 text-gray-600 dark:text-gray-300">
        A plan that scales with your rapidly growing business.
      </p>
      <p className="mt-6 flex items-baseline gap-x-1 group-[:not(:has([name=frequency][value=monthly]:checked))]/tiers:hidden">
        <span className="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">
          {plan.currency}
          {plan.amount}
        </span>
        <span className="text-sm/6 font-semibold text-gray-600 dark:text-gray-400">
          /{plan.interval}
        </span>
      </p>

      <ActionGuard permission={Permission.SUBSCRIBE_PLAN}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Button
            type="submit"
            className="mt-6 w-full px-3 py-2 text-center text-sm/6 font-semibold"
          >
            Subscribe
          </Button>
        </form>
      </ActionGuard>
      <ul
        role="list"
        className="mt-8 space-y-3 text-sm/6 text-gray-600 xl:mt-10 dark:text-gray-300"
      >
        {plan.features?.map((feature) => (
          <li key={feature.id} className="flex gap-x-3">
            <Check className="h-6 w-5 flex-none text-brand-600 dark:text-brand-400" />

            {feature.feature}
          </li>
        ))}
      </ul>
    </div>
  );
}
