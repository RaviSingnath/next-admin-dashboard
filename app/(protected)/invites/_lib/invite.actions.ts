"use server";

import {
  TInvitePayload,
  zInvitePayload,
  zResendInvitePayload,
} from "@/features/invite/invite.schema";
import {
  inviteUserService,
  resendInviteService,
  revokeInviteService,
} from "@/features/invite/invite.service";
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

/**
 * Server action — Resend Invite
 **/
export async function resendInviteAction(
  invitationId: string,
): Promise<ActionResponse> {
  try {
    // 1. Input validation — rejects missing, empty, or non-UUID values
    //    before any auth or DB call is made.
    const { invitationId: validatedId } = zResendInvitePayload.parse({
      invitationId,
    });

    // 2. Build request context — authenticates the caller via getUser().
    //    Throws Errors.unauthorized() if the session is missing or expired.
    const ctx = await createRequestContext();

    // 3. Delegate to service — all RBAC and business checks run here.
    const invitation = await resendInviteService({
      ctx,
      inviteID: validatedId,
    });

    revalidatePath("/invites", "page");

    return { success: true, data: invitation };
  } catch (error) {
    return handleError(error);
  }
}

export const revokeInviteAction = async (
  inviteID: string,
): Promise<ActionResponse> => {
  try {
    const ctx = await createRequestContext();

    if (!inviteID) {
      return {
        success: false,
        code: ERROR_CODES.NOT_FOUND,
        message: "Invite not found",
      };
    }

    const invite = await revokeInviteService({
      ctx,
      inviteID,
    });

    revalidatePath("/invites", "page");

    return {
      success: true,
      data: invite,
    };
  } catch (error) {
    return handleError(error);
  }
};
