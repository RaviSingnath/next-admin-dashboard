import { NextResponse } from "next/server";
import { zCollege } from "@/features/colleges/college.schema";
import { createCollege } from "@/features/colleges/college.service";
import { getZodFieldErrors } from "@/lib/helper/get-zod-field-errors";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Server-side validation
    const validatedFields = zCollege.safeParse(body);

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

    const college = await createCollege(validatedFields.data);

    return NextResponse.json(
      {
        success: true,
        data: college,
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
