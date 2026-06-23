"use server";

import {
  TSupervisorInvite,
  zSupervisorInvite,
} from "@/features/supervisors/supervisors.schema";
import { inviteSupervisorService } from "@/features/supervisors/supervisors.services";
import { ERROR_CODES } from "@/lib/errors/error-codes";
import { handleError } from "@/lib/errors/handle-error";
import { getZodFieldErrors } from "@/lib/helper/get-zod-field-errors";
import { revalidatePath } from "next/cache";

export const InviteSupervisorAction = async (data: TSupervisorInvite) => {
  try {
    const validatedFields = zSupervisorInvite.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        code: ERROR_CODES.VALIDATION_ERROR,
        errors: getZodFieldErrors(validatedFields.error),
      };
    }

    const college = await inviteSupervisorService(validatedFields.data);

    revalidatePath("/supervisors", "page");

    return {
      success: true,
      data: college,
    };
  } catch (error) {
    return handleError(error);
  }
};
