import { cn } from "@/lib/utils";
import { Plans } from "@/features/stripe/service/stripe.services";
import Button from "@/components/ui/button/Button";
import { Check } from "lucide-react";

type PricingCardProps = {
  plans: Plans;
};

export default function PricingCard({ plans }: PricingCardProps) {
  return (
    <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
      {plans.map((plan, index) => (
        <div
          key={plan.id}
          className={cn(
            `flex flex-col justify-between rounded-3xl bg-white p-8 inset-ring inset-ring-gray-200 xl:p-10 dark:bg-gray-800/50 dark:inset-ring-gray-700`,
            index === 1 ? "lg:rounded-b-none" : "-ml-px -mr-px  lg:mt-8",
            index === 0 ? "lg:rounded-r-none" : "",
            index === 2 ? "lg:rounded-l-none" : "",
          )}
        >
          <div>
            <div className="flex items-center justify-between gap-x-4">
              <h3
                id="tier-freelancer"
                className="text-lg/8 font-semibold text-gray-900 dark:text-white"
              >
                {plan.name}
              </h3>
              {index === 1 && (
                <p className="rounded-full bg-brand-600/10 px-2.5 py-1 text-xs/5 font-semibold text-brand-600 dark:bg-brand-400/10 dark:text-brand-400">
                  Most popular
                </p>
              )}
            </div>
            <p className="mt-4 text-sm/6 text-gray-600 dark:text-gray-300">
              {plan.description}
            </p>
            <p className="mt-6 flex items-baseline gap-x-1">
              <span className="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">
                ${plan.monthly.amount}
              </span>
              <span className="text-sm/6 font-semibold text-gray-600 dark:text-gray-400">
                /{plan.monthly.interval}
              </span>
            </p>
            <ul
              role="list"
              className="mt-8 space-y-3 text-sm/6 text-gray-600 dark:text-gray-300"
            >
              {plan.features.map((feature) => (
                <li key={feature.id} className="flex gap-x-3">
                  <Check className="h-6 w-5 flex-none text-brand-600 dark:text-brand-400" />
                  {feature.feature}
                </li>
              ))}
            </ul>
          </div>
          {index !== 1 ? (
            <Button variant="outline" size="sm" className="mt-8 block">
              Buy plan
            </Button>
          ) : (
            <Button size="sm" className="mt-8 block">
              Buy plan
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
