"use server";

import { getZodFieldErrors } from "@/lib/helper/get-zod-field-errors";
import { createCollegeService } from "@/features/colleges/college.service";
import { TCollege, zCollege } from "@/features/colleges/college.schema";
import { revalidatePath } from "next/cache";
import { ERROR_CODES } from "@/lib/errors/error-codes";
import { handleError } from "@/lib/errors/handle-error";
import { ActionResponse } from "@/lib/types/action-response";
import { createRequestContext } from "@/lib/auth/request-context";

export const createCollegeAction = async (
  data: TCollege,
): Promise<ActionResponse> => {
  try {
    const ctx = await createRequestContext();

    const validatedFields = zCollege.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        code: ERROR_CODES.VALIDATION_ERROR,
        message: "Validation failed",
        errors: getZodFieldErrors(validatedFields.error),
      };
    }

    const college = await createCollegeService({
      ctx,
      data: validatedFields.data,
    });

    revalidatePath("/colleges", "page");

    return {
      success: true,
      data: college,
    };
  } catch (error) {
    return handleError(error);
  }
};
