"use server";

import {
  TProfileInfo,
  zImageFile,
  zProfileInfo,
} from "@/features/profile/profile.schema";
import {
  updateAvatarService,
  updateProfifleInfoService,
} from "@/features/profile/profile.services";
import { getZodErrors } from "@/lib/helper/get-zod-errors";
import { revalidatePath } from "next/cache";

export async function uploadAvatarAction(formData: FormData) {
  const file = formData.get("imageFile") as File;

  const validatedFields = zImageFile.safeParse({ imageFile: file });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: getZodErrors(validatedFields.error),
    };
  }

  try {
    const department = await updateAvatarService(validatedFields.data);

    revalidatePath("profile/", "page");

    return {
      success: true,
      data: department,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    };
  }
}

export async function updateProfileInfoAction(formData: TProfileInfo) {
  const validatedFields = zProfileInfo.safeParse(formData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: getZodErrors(validatedFields.error),
    };
  }

  try {
    const profile = await updateProfifleInfoService(validatedFields.data);

    revalidatePath("profile/", "page");

    return {
      success: true,
      data: profile,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    };
  }
}
