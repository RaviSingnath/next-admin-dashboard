"use server";

import { createAdminClient } from "@/lib/supabase/admin";
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

export async function getCollegeById(collegeId: string) {
  const supabase = await createClient();

  return supabase
    .from("colleges")
    .select("stripe_customer_id")
    .eq("id", collegeId)
    .single();
}

export async function getActiveColleges() {
  const supabase = createAdminClient();

  return supabase
    .from("colleges")
    .select(
      `id,
      college_name,
      addresses!colleges_address_id_fkey (
        id,
        latitude,
        longitude
      )`,
    )
    .eq("status", "active");
}
