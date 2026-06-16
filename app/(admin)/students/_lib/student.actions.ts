"use server";

import {
  zStudentInvite,
  TStudentInvite,
} from "@/features/students/students.schema";
import { inviteStudentService } from "@/features/students/students.services";
import { ERROR_CODES } from "@/lib/errors/error-codes";
import { handleError } from "@/lib/errors/handle-error";
import { getZodFieldErrors } from "@/lib/helper/get-zod-field-errors";
import { ActionResponse } from "@/lib/types/action-response";
import { revalidatePath } from "next/cache";

export const inviteStudentAction = async (
  data: TStudentInvite,
): Promise<ActionResponse> => {
  try {
    const validatedFields = zStudentInvite.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        code: ERROR_CODES.VALIDATION_ERROR,
        message: "Validation failed",
        errors: getZodFieldErrors(validatedFields.error),
      };
    }

    const college = await inviteStudentService(validatedFields.data);

    revalidatePath("/students", "page");

    return {
      success: true,
      data: college,
    };
  } catch (error) {
    return handleError(error);
  }
};
