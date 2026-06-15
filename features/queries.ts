"use server";

import createClient from "@/lib/supabase/server";

export const getCreatorQuery = async (creatorID: string) => {
  const supabase = await createClient();

  return supabase
    .from("profiles")
    .select("id, full_name, email, role")
    .eq("id", creatorID)
    .maybeSingle();
};
