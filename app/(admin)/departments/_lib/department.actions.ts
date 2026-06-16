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

export async function createDepartmentAction(formData: TAddDepartment) {
  const validatedFields = zAddDepartment.safeParse(formData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: getZodFieldErrors(validatedFields.error),
    };
  }

  try {
    const department = await createDepartmentService(validatedFields.data);

    revalidatePath("/departments", "page");

    return {
      success: true,
      data: department,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    };
  }
}

export async function softDeleteDepartmentAction(departmentId: string) {
  if (!departmentId) {
    return {
      success: false,
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
    return {
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    };
  }
}
