"use server";

import createClient from "@/lib/supabase/server";

export const getUserQuery = async (id: string) => {
  const supabase = await createClient();

  return supabase
    .from("profiles")
    .select(
      `
    id,
    full_name,
    email,
    role,
    status,
    college_id,
    department_id,
    created_at,
    deleted_at,
    created_by
  `,
    )
    .eq("id", id)
    .single();
};
