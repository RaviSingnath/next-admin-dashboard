import { NextResponse } from "next/server";
import { getZodErrors } from "@/lib/helper/get-zod-errors";
import { zImageFile } from "@/lib/validations/admin/college-schema";
import { updateAvatar } from "@/lib/services/auth.service";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("imageFile") as File;

    const validatedFields = zImageFile.safeParse({
      imageFile: file,
    });

    if (!validatedFields.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: getZodErrors(validatedFields.error),
        },
        { status: 400 },
      );
    }

    const department = await updateAvatar(validatedFields.data);

    return NextResponse.json(
      {
        success: true,
        data: department,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}
