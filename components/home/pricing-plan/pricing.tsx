import { Plans } from "@/features/stripe/service/stripe.services";
import PlanCard from "./plan-card";
import PlanDetails from "./plan-details";
import PlanPrice from "./plan-price";
import PricingCard from "./pricing-card";

type PricingProps = {
  plans: Plans;
};

export default function Pricing({ plans }: PricingProps) {
  return (
    <div className="bg-white w-full py-24 sm:py-32 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl sm:text-center">
          <h2 className="text-5xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-6xl sm:text-balance dark:text-white">
            Simple, Transparent Pricing for Every Institution
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg font-medium text-pretty text-gray-500 sm:text-xl/8 dark:text-gray-400">
            Choose a plan that fits your college&apos;s size and needs — manage
            students, supervisors, departments, and payments all in one place.
          </p>
        </div>

        <PricingCard plans={plans} />

        <PlanCard>
          <PlanDetails />
          <PlanPrice />
        </PlanCard>
      </div>
    </div>
  );
}
