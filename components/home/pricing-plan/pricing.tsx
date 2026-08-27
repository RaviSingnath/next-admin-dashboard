import { Plans } from "@/features/stripe/service/stripe.services";
import PlanCard from "./plan-card";
import PlanDetails from "./plan-details";
import PlanPrice from "./plan-price";
import PricingCard from "./pricing-card";
import PricingContainer from "./pricing-container";

type PricingProps = {
  plans: Plans;
};

export default function Pricing({ plans }: PricingProps) {
  return (
    <PricingContainer>
      <PricingCard plans={plans} />

      <PlanCard>
        <PlanDetails />
        <PlanPrice />
      </PlanCard>
    </PricingContainer>
  );
}
