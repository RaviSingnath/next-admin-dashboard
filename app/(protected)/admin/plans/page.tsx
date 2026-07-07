"use server";

import { PlanPricingForm } from "@/components/stripe/pricing-form";
import { getPlansService } from "@/features/stripe/service/stripe.services";
import { syncPlansFromStripe } from "@/features/stripe/stripe.action";

export default async function SyncPlansPage() {
  const plans = await getPlansService();

  async function handleSync() {
    "use server";
    const result = await syncPlansFromStripe();
    console.log(
      `Synced ${result.synced} plans, deactivated ${result.deactivated}`,
    );
  }

  return (
    <div>
      <form action={handleSync}>
        <button type="submit">Sync Plans</button>
      </form>
      {plans?.map((plan) => (
        <PlanPricingForm key={plan.id} plan={plan} />
      ))}
    </div>
  );
}
