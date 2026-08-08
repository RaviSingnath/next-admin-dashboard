"use server";

import { COLLEGE_LOGO_BUCKET } from "@/lib/constants/db";
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
      logo_url,
      addresses!colleges_address_id_fkey (
        id,
        latitude,
        longitude,
        city,
        country
      )`,
    )
    .eq("status", "active");
}

export const getCollegeProfileQuery = async (collegeId: string) => {
  const supabase = await createClient();

  return supabase
    .from("colleges")
    .select(
      `
      id,
      college_name,
      official_email,
      phone,
      status,
      logo_url,
      created_at,
      address_id,
      addresses (
        city,
        state_province,
        country,
        country_code,
        postal_code,
        address_line_1,
        address_line_2
      ),
      departments (
        id,
        department_name,
        deleted_at
      ),
      college_subscriptions (
        id,
        status,
        plan_id,
        current_period_end,
        cancel_at_period_end
      )
    `,
    )
    .eq("id", collegeId)
    .is("departments.deleted_at", null)
    .single();
};

export const getLogoSignedUrlQuery = async (avatar: string) => {
  const supabase = createAdminClient();
  return supabase.storage
    .from(COLLEGE_LOGO_BUCKET)
    .createSignedUrl(avatar, 60 * 60);
};

export async function getAllSubscriptionsQuery(collegeId: string) {
  const supabase = await createClient();

  return supabase
    .from("college_subscriptions")
    .select(
      `
      id,
      stripe_subscription_id,
      status,
      current_period_end,
      current_period_start,
      cancel_at_period_end,
      canceled_at,
      trial_end,
      latest_invoice_id,
      stripe_latest_invoice_number,
      latest_invoice_url,
      created_at,
      status,
      plan:subscription_plans (
        id,
        amount,
        currency,
        interval,
        product:stripe_products (
          name,
          description
        )
      )
    `,
    )
    .eq("college_id", collegeId)
    .order("created_at", { ascending: false });
}

export async function getActiveSubscriptionQuery(collegeId: string) {
  const supabase = await createClient();

  return supabase
    .from("college_subscriptions")
    .select(
      `
      id,
      stripe_subscription_id,
      status,
      current_period_end,
      current_period_start,
      cancel_at_period_end,
      canceled_at,
      trial_end,
      plan:subscription_plans (
        id,
        amount,
        currency,
        interval,
        product:stripe_products (
          name,
          description
        )
      )
    `,
    )
    .eq("college_id", collegeId)
    .eq("status", "active")
    .maybeSingle();
}
