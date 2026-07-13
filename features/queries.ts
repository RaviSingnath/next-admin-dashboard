"use server";

import { AVATAR_BUCKET } from "@/lib/constants/db";
import createClient from "@/lib/supabase/server";
import { QueryData } from "@supabase/supabase-js";

export const getCreatorQuery = async (creatorID: string) => {
  const supabase = await createClient();

  return supabase
    .from("profiles")
    .select("id, full_name, email, role")
    .eq("id", creatorID)
    .maybeSingle();
};

export const getAvatarSignedUrlQuery = async (avatar: string) => {
  const supabase = await createClient();
  return supabase.storage.from(AVATAR_BUCKET).createSignedUrl(avatar, 60 * 60);
};

export const getCurrentUserQuery = async (userID: string) => {
  const supabase = await createClient();

  return supabase
    .from("profiles")
    .select(
      `
      id,
      email,
      full_name,
      role,
      college_id,
      department_id,
      avatar,
      phone,
      status,
      address_id,
      addresses (
        city,
        state_province,
        country,
        country_code,
        postal_code
      ),
      colleges (
        college_name,
        status,
        departments (
          id,
          department_name,
          deleted_at
        ),
        college_subscriptions (
          id,
          status,
          plan_id
        ),
        addresses (
          id
        )
      ),
      departments!department_id (
        department_name
      )
    `,
    )
    .eq("id", userID)
    .single();
};

export type CurrentUserQueryResult = QueryData<
  ReturnType<typeof getCurrentUserQuery>
>;
