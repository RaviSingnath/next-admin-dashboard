import { NextResponse } from "next/server";
import { getZodFieldErrors } from "@/lib/helper/get-zod-field-errors";
import { zUpdatePassword } from "@/lib/validations/admin/college-schema";
import { updatePassword } from "@/lib/services/auth.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Server-side validation
    const validatedFields = zUpdatePassword.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: getZodFieldErrors(validatedFields.error),
        },
        { status: 400 },
      );
    }

    const data = await updatePassword(validatedFields.data);

    return NextResponse.json(
      {
        success: true,
        data: data,
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
