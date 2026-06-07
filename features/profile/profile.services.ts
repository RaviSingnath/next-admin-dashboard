import sharp from "sharp";
import { TImageFile, TProfileInfo } from "./profile.schema";
import {
  updateAvatarPath,
  updateProfileInfo,
  uploadAvatar,
} from "./profile.mutations";
import { getCurrentUserServer } from "@/lib/autth/getCurrentUserServer";
import { AppError } from "@/lib/app-error";

export async function updateAvatarService(data: TImageFile) {
  const user = await getCurrentUserServer();

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

  const { error: uploadError } = await uploadAvatar(filePath, webpBuffer);

  if (uploadError) throw uploadError;

  const { data: updatedData, error: profileUpdateError } =
    await updateAvatarPath(user.id, filePath);

  if (profileUpdateError) throw profileUpdateError;

  return {
    profile: updatedData,
  };
}

export async function updateProfifleInfoService(data: TProfileInfo) {
  const profile = await getCurrentUserServer();

  if (!profile) {
    throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
  }

  if (profile.status !== "active") {
    throw new Error("Inactive users cannot create departments");
  }

  const { data: updatedProfile, error: profileUpdateError } =
    await updateProfileInfo(profile.id, data);

  if (profileUpdateError) throw profileUpdateError;

  return {
    profile: updatedProfile,
  };
}
