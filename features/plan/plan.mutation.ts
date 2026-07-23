import createClient from "@/lib/supabase/server";
import { TPlanFeature } from "./plan.schema";

export const updatePlanMutation = async (
  planId: string,
  displayOrder: number,
) => {
  const supabase = await createClient();

  return supabase
    .from("stripe_products")
    .update({ display_order: displayOrder })
    .eq("id", planId)
    .single();
};

export const updateFeaturePlanMutation = async (
  planId: string,
  data: TPlanFeature[],
) => {
  const supabase = await createClient();

  return supabase.rpc("upsert_product_features", {
    p_product_id: planId,
    p_features: data,
  });
};
