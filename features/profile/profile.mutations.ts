import createClient from "@/lib/supabase/server";
import { AVATAR_BUCKET } from "@/lib/constants/db";
import { TProfileInfo } from "./profile.schema";

export const uploadAvatar = async (filePath: string, webpBuffer: Buffer) => {
  const supabase = await createClient();

  return supabase.storage.from(AVATAR_BUCKET).upload(filePath, webpBuffer, {
    cacheControl: "3600",
    upsert: true,
    contentType: "image/webp",
  });
};

export const updateAvatarPath = async (userID: string, filePath: string) => {
  const supabase = await createClient();

  return supabase
    .from("profiles")
    .update({ avatar: filePath })
    .eq("id", userID)
    .maybeSingle();
};

export const updateProfileInfo = async (userID: string, data: TProfileInfo) => {
  const supabase = await createClient();

  return supabase.from("profiles").update(data).eq("id", userID).maybeSingle();
};
