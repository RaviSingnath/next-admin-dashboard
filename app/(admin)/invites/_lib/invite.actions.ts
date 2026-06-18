"use server";

import {
  TInvitePayload,
  zInvitePayload,
} from "@/features/invite/invite.schema";
import { inviteUserService } from "@/features/invite/invite.service";
import { createRequestContext } from "@/lib/auth/request-context";
import { ERROR_CODES } from "@/lib/errors/error-codes";
import { handleError } from "@/lib/errors/handle-error";
import { getZodFieldErrors } from "@/lib/helper/get-zod-field-errors";
import { ActionResponse } from "@/lib/types/action-response";
import { revalidatePath } from "next/cache";

export const inviteUserAction = async (
  data: TInvitePayload,
): Promise<ActionResponse> => {
  try {
    const ctx = await createRequestContext();

    const validatedFields = zInvitePayload.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        code: ERROR_CODES.VALIDATION_ERROR,
        message: "Validation failed",
        errors: getZodFieldErrors(validatedFields.error),
      };
    }

    const college = await inviteUserService({
      ctx,
      data: validatedFields.data,
    });

    revalidatePath("/students", "page");

    return {
      success: true,
      data: college,
    };
  } catch (error) {
    return handleError(error);
  }
};
