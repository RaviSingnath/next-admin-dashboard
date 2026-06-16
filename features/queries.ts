"use server";

import { AVATAR_BUCKET } from "@/lib/constants/db";
import createClient from "@/lib/supabase/server";

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
