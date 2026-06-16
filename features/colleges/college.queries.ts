"use server";

import createClient from "@/lib/supabase/server";

export async function getCollegesQuery() {
  const supabase = await createClient();

  return supabase
    .from("colleges")
    .select(
      `
      id,
      college_name,
      official_email,
      phone,
      logo_url,
      country,
      status,
      stripe_connected_account_id,
      created_at,
      profiles (
        id,
        full_name,
        avatar,
        status
      )
    `,
    )
    .order("created_at", { ascending: false });
}

export async function getCollegeByEmailQuery(email: string) {
  const supabase = await createClient();

  return supabase
    .from("colleges")
    .select("id")
    .eq("official_email", email)
    .maybeSingle();
}
