"use server";

import { PlanList } from "@/components/stripe/plan-list";
import {
  getCollegeSubscription,
  getPlansService,
} from "@/features/stripe/service/stripe.services";

export default async function PlansPage() {
  const plans = await getPlansService();
  const subscription = await getCollegeSubscription();

  if (!plans) return;

  return <PlanList plans={plans} />;
}
