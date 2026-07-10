"use server";

import { RequestContext } from "@/lib/auth/request-context";
import { TAdminPlan } from "./plan.schema";
import { updateFeaturePlanMutation, updatePlanMutation } from "./plan.mutation";
import { mapSupabaseError } from "@/lib/errors/supabase-error";

type updatePlanServiceInput = {
  ctx: RequestContext;
  planId: string;
  formData: TAdminPlan;
};

export async function updatePlanService({
  ctx,
  planId,
  formData,
}: updatePlanServiceInput) {
  const { error: planError } = await updatePlanMutation(
    planId,
    formData.display_order,
  );

  if (planError) throw mapSupabaseError(planError);

  const { error: featurePlanError } = await updateFeaturePlanMutation(
    planId,
    formData.features,
  );

  if (featurePlanError) throw mapSupabaseError(featurePlanError);

  return { success: true };
}
