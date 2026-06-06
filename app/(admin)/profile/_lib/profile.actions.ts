"use server";

import { zImageFile } from "@/features/profile/profile.schema";
import { updateAvatarService } from "@/features/profile/profile.services";
import { getZodErrors } from "@/lib/helper/get-zod-errors";
import { revalidatePath } from "next/cache";

export async function uploadAvatarAction(formData: FormData) {
  const file = formData.get("imageFile") as File;

  const validatedFields = zImageFile.safeParse({ imageFile: file });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: getZodErrors(validatedFields.error),
    };
  }

  try {
    const department = await updateAvatarService(validatedFields.data);

    revalidatePath("profile/", "page");

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
