"use server";

import {
  zCollegeAdminInvite,
  TCollegeAdminInvite,
} from "@/features/college-admins/college-admin.schema";
import { inviteCollegeAdminService } from "@/features/college-admins/college-admin.services";
import { createRequestContext } from "@/lib/auth/request-context";
import { ERROR_CODES } from "@/lib/errors/error-codes";
import { handleError } from "@/lib/errors/handle-error";
import { getZodFieldErrors } from "@/lib/helper/get-zod-field-errors";
import { revalidatePath } from "next/cache";

export const InviteCollegeAdminAction = async (data: TCollegeAdminInvite) => {
  try {
    const ctx = await createRequestContext();

    const validatedFields = zCollegeAdminInvite.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        code: ERROR_CODES.VALIDATION_ERROR,
        errors: getZodFieldErrors(validatedFields.error),
      };
    }

    const college = await inviteCollegeAdminService({
      ctx,
      data: validatedFields.data,
    });

    revalidatePath("/college-admins", "page");

    return {
      success: true,
      data: college,
    };
  } catch (error) {
    return handleError(error);
  }
};
