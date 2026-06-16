"use server";

import {
  TSupervisorInvite,
  zSupervisorInvite,
} from "@/features/supervisors/supervisors.schema";
import { inviteSupervisorService } from "@/features/supervisors/supervisors.services";
import { getZodFieldErrors } from "@/lib/helper/get-zod-field-errors";
import { revalidatePath } from "next/cache";

export const InviteSupervisorAction = async (data: TSupervisorInvite) => {
  try {
    const validatedFields = zSupervisorInvite.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Validation failed",
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
    return {
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    };
  }
};
