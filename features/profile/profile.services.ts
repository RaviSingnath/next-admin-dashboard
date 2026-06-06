import { AVATAR_BUCKET } from "@/lib/constants/db";
import createClient from "@/lib/supabase/server";
import sharp from "sharp";
import { TImageFile } from "./profile.schema";

export async function updateAvatarService(data: TImageFile) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    throw new Error("Your not authenticated.");
  }

  const file = data.imageFile;

  const filePath = `${user.id}/avatar.webp`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const webpBuffer = await sharp(buffer)
    .resize(500, 500, {
      fit: "cover",
      position: "centre",
    })
    .webp({ quality: 80 })
    .toBuffer();

  const { error: uploadError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(filePath, webpBuffer, {
      cacheControl: "3600",
      upsert: true,
      contentType: "image/webp",
    });

  if (uploadError) throw uploadError;

  const { data: updatedData, error: profileUpdateError } = await supabase
    .from("profiles")
    .update({ avatar: filePath })
    .eq("id", user.id)
    .maybeSingle();

  if (profileUpdateError) throw profileUpdateError;

  return {
    profile: updatedData,
  };
}
