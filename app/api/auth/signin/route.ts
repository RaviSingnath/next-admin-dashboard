import { NextResponse } from "next/server";
import { signinUser } from "@/lib/services/auth.service";
import { getZodErrors } from "@/lib/helper/get-zod-errors";
import { zSignIn } from "@/lib/validations/admin/college-schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Server-side validation
    const validatedFields = zSignIn.safeParse(body);

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

    const acceptedInvite = await signinUser(validatedFields.data);

    return NextResponse.json(
      {
        success: true,
        data: acceptedInvite,
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
