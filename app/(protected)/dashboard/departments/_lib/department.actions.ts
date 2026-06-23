"use server";

import {
  TAddDepartment,
  zAddDepartment,
} from "@/features/departments/department.schema";
import { getZodFieldErrors } from "@/lib/helper/get-zod-field-errors";
import { revalidatePath } from "next/cache";
import {
  createDepartmentService,
  softDeleteDepartmentService,
} from "@/features/departments/department.services";
import { handleError } from "@/lib/errors/handle-error";
import { ActionResponse } from "@/lib/types/action-response";
import { ERROR_CODES } from "@/lib/errors/error-codes";
import { createRequestContext } from "@/lib/auth/request-context";

export async function createDepartmentAction(
  formData: TAddDepartment,
): Promise<ActionResponse> {
  const ctx = await createRequestContext();

  const validatedFields = zAddDepartment.safeParse(formData);

  if (!validatedFields.success) {
    return {
      success: false,
      code: ERROR_CODES.VALIDATION_ERROR,
      message: "Validation failed",
      errors: getZodFieldErrors(validatedFields.error),
    };
  }

  try {
    const department = await createDepartmentService({
      ctx,
      data: validatedFields.data,
    });

    revalidatePath("/departments", "page");

    return {
      success: true,
      data: department,
    };
  } catch (error) {
    return handleError(error);
  }
}

export async function softDeleteDepartmentAction(departmentId: string) {
  if (!departmentId) {
    return {
      success: false,
      code: ERROR_CODES.NOT_FOUND,
      message: "Department ID not found",
    };
  }

  try {
    const department = await softDeleteDepartmentService(departmentId);

    revalidatePath("/departments", "page");

    return {
      success: true,
      data: department,
    };
  } catch (error) {
    return handleError(error);
  }
}
