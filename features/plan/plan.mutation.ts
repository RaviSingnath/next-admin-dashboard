import createClient from "@/lib/supabase/server";
import { TAdminPlan } from "./plan.schema";

export const updatePlanMutation = async (planId: string, data: TAdminPlan) => {
  const supabase = await createClient();

  return supabase
    .from("subscription_plans")
    .update(data)
    .eq("id", planId)
    .single();
};
