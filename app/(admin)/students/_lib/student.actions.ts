"use server";

import {
  zStudentInvite,
  TStudentInvite,
} from "@/features/students/students.schema";
import { inviteStudentService } from "@/features/students/students.services";
import { getZodFieldErrors } from "@/lib/helper/get-zod-field-errors";
import { revalidatePath } from "next/cache";

export const inviteStudentAction = async (data: TStudentInvite) => {
  try {
    const validatedFields = zStudentInvite.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
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
    return {
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    };
  }
};
