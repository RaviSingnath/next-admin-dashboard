import sharp from "sharp";
import { TImageFile, TProfileInfo } from "./profile.schema";
import {
  updateAvatarPath,
  updateProfileInfo,
  uploadAvatar,
} from "./profile.mutations";
import { RequestContext } from "@/lib/auth/request-context";

type updateAvatarServiceInput = {
  ctx: RequestContext;
  data: TImageFile;
};

export async function updateAvatarService({
  ctx,
  data,
}: updateAvatarServiceInput) {
  const file = data.imageFile;

  const filePath = `${ctx.user.id}/avatar.webp`;

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
    await updateAvatarPath(ctx.user.id, filePath);

  if (profileUpdateError) throw profileUpdateError;

  return {
    profile: updatedData,
  };
}

type updateProfifleInfoServiceInput = {
  ctx: RequestContext;
  data: TProfileInfo;
};

export async function updateProfifleInfoService({
  ctx,
  data,
}: updateProfifleInfoServiceInput) {
  if (ctx.user.status !== "active") {
    throw new Error("Inactive users cannot create departments");
  }

  const { data: updatedProfile, error: profileUpdateError } =
    await updateProfileInfo(ctx.user.id, data);

  if (profileUpdateError) throw profileUpdateError;

  return {
    profile: updatedProfile,
  };
}
