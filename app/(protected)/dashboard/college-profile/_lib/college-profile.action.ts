"use server";

import { TEditAddress, zEditAddress } from "@/features/address/address.schema";
import { uploadLogoService } from "@/features/colleges/college.service";
import { updateCollegeAddrerssService } from "@/features/colleges/services/update-college-address";
import { zImageFile } from "@/features/profile/profile.schema";
import { createRequestContext } from "@/lib/auth/request-context";
import { ERROR_CODES } from "@/lib/errors/error-codes";
import { handleError } from "@/lib/errors/handle-error";
import { getZodFieldErrors } from "@/lib/helper/get-zod-field-errors";
import { ActionResponse } from "@/lib/types/action-response";
import { revalidatePath } from "next/cache";

export async function updateCollegeAddressAction(
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
    const profile = await updateCollegeAddrerssService({
      ctx,
      data: validatedFields.data,
    });

    revalidatePath("/dashboard/college-profile", "page");

    return {
      success: true,
      data: profile,
    };
  } catch (error) {
    return handleError(error);
  }
}

export async function uploadLogoAction(
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
    const department = await uploadLogoService({
      ctx,
      data: validatedFields.data,
    });

    revalidatePath("/dashboard/college-profile", "page");

    return {
      success: true,
      data: department,
    };
  } catch (error) {
    return handleError(error);
  }
}
