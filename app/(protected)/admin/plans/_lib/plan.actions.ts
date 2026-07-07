"use server";

import { createRequestContext } from "@/lib/auth/request-context";
import { ActionResponse } from "@/lib/types/action-response";
import { zAdminPlan, TAdminPlan } from "@/features/plan/plan.schema";
import { ERROR_CODES } from "@/lib/errors/error-codes";
import { getZodFieldErrors } from "@/lib/helper/get-zod-field-errors";
import { revalidatePath } from "next/cache";
import { handleError } from "@/lib/errors/handle-error";
import { updatePlanService } from "@/features/plan/plan.services";

export async function updatePlanAction(
  planId: string,
  formData: TAdminPlan,
): Promise<ActionResponse> {
  const ctx = await createRequestContext();

  const validatedFields = zAdminPlan.safeParse(formData);

  if (!validatedFields.success) {
    return {
      success: false,
      code: ERROR_CODES.VALIDATION_ERROR,
      message: "Validation failed",
      errors: getZodFieldErrors(validatedFields.error),
    };
  }

  try {
    const profile = await updatePlanService({
      ctx,
      planId,
      formData: validatedFields.data,
    });

    revalidatePath("/admin/plans", "page");

    return {
      success: true,
      data: profile,
    };
  } catch (error) {
    return handleError(error);
  }
}
