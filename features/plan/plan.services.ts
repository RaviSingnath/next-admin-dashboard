"use server";

import { RequestContext } from "@/lib/auth/request-context";
import { TAdminPlan } from "./plan.schema";
import { updatePlanMutation } from "./plan.mutation";
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
  console.log(formData);
  const { data, error } = await updatePlanMutation(planId, formData);

  if (error) throw mapSupabaseError(error);

  return {
    data,
  };
}
