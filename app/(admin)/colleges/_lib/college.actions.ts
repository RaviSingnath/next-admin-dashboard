"use server";

import { getZodFieldErrors } from "@/lib/helper/get-zod-field-errors";
import { createCollege } from "@/features/colleges/college.service";
import { TCollege, zCollege } from "@/features/colleges/college.schema";
import { revalidatePath } from "next/cache";

export const createCollegeAction = async (data: TCollege) => {
  try {
    const validatedFields = zCollege.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: getZodFieldErrors(validatedFields.error),
      };
    }

    const college = await createCollege(validatedFields.data);

    revalidatePath("/colleges", "page");

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
