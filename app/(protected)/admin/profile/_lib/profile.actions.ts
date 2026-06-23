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
import { createRequestContext } from "@/lib/auth/request-context";
import { ERROR_CODES } from "@/lib/errors/error-codes";
import { handleError } from "@/lib/errors/handle-error";
import { getZodFieldErrors } from "@/lib/helper/get-zod-field-errors";
import { ActionResponse } from "@/lib/types/action-response";
import { revalidatePath } from "next/cache";

export async function uploadAvatarAction(
  formData: FormData,
): Promise<ActionResponse> {
  const ctx = await createRequestContext();

  const file = formData.get("imageFile") as File;

  const validatedFields = zImageFile.safeParse({ imageFile: file });

  if (!validatedFields.success) {
    return {
      success: false,
      code: ERROR_CODES.VALIDATION_ERROR,
      message: "Validation failed",
      errors: getZodFieldErrors(validatedFields.error),
    };
  }

  try {
    const department = await updateAvatarService({
      ctx,
      data: validatedFields.data,
    });

    revalidatePath("profile/", "page");

    return {
      success: true,
      data: department,
    };
  } catch (error) {
    return handleError(error);
  }
}

export async function updateProfileInfoAction(
  formData: TProfileInfo,
): Promise<ActionResponse> {
  const ctx = await createRequestContext();

  const validatedFields = zProfileInfo.safeParse(formData);

  if (!validatedFields.success) {
    return {
      success: false,
      code: ERROR_CODES.VALIDATION_ERROR,
      message: "Validation failed",
      errors: getZodFieldErrors(validatedFields.error),
    };
  }

  try {
    const profile = await updateProfifleInfoService({
      ctx,
      data: validatedFields.data,
    });

    revalidatePath("/profile", "page");

    return {
      success: true,
      data: profile,
    };
  } catch (error) {
    return handleError(error);
  }
}

export async function updateAddressAction(
  formData: TEditAddress,
): Promise<ActionResponse> {
  const ctx = await createRequestContext();

  const validatedFields = zEditAddress.safeParse(formData);

  if (!validatedFields.success) {
    return {
      success: false,
      code: ERROR_CODES.VALIDATION_ERROR,
      message: "Validation failed",
      errors: getZodFieldErrors(validatedFields.error),
    };
  }

  try {
    console.log("updateAddrerssService");
    const profile = await updateAddrerssService({
      ctx,
      data: validatedFields.data,
    });

    revalidatePath("/profile", "page");

    return {
      success: true,
      data: profile,
    };
  } catch (error) {
    return handleError(error);
  }
}
