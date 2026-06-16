"use server";

import { TEditAddress, zEditAddress } from "@/features/address/address.schema";
import { updateAddrerssService } from "@/features/address/address.service";
import {
  TProfileInfo,
  zImageFile,
  zProfileInfo,
} from "@/features/profile/profile.schema";
import {
  updateAvatarService,
  updateProfifleInfoService,
} from "@/features/profile/profile.services";
import { getZodFieldErrors } from "@/lib/helper/get-zod-field-errors";
import { revalidatePath } from "next/cache";

export async function uploadAvatarAction(formData: FormData) {
  const file = formData.get("imageFile") as File;

  const validatedFields = zImageFile.safeParse({ imageFile: file });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: getZodFieldErrors(validatedFields.error),
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
      errors: getZodFieldErrors(validatedFields.error),
    };
  }

  try {
    const profile = await updateProfifleInfoService(validatedFields.data);

    revalidatePath("/profile", "page");

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

export async function updateAddressAction(formData: TEditAddress) {
  const validatedFields = zEditAddress.safeParse(formData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: getZodFieldErrors(validatedFields.error),
    };
  }

  try {
    console.log("updateAddrerssService");
    const profile = await updateAddrerssService(validatedFields.data);

    revalidatePath("/profile", "page");

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
