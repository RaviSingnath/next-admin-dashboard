"use server";

import createClient from "@/lib/supabase/server";

export const getSupervisorsQuery = async () => {
  const supabase = await createClient();

  return supabase
    .from("profiles")
    .select(
      `
    id,
    full_name,
    email,
    status,
    created_at,
    deleted_at,
    created_by
  `,
    )
    .order("created_at", { ascending: false })
    .eq("role", "supervisor");
};
