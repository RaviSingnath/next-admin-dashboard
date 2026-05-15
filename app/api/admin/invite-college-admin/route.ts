import { NextResponse } from "next/server";

import { zCollegeAdminInvite } from "@/lib/validations/admin/college-schema";
import { inviteCollegeAdmin } from "@/lib/services/super-admin.service";
import { getZodErrors } from "@/lib/helper/get-zod-errors";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Server-side validation
    const validatedFields = zCollegeAdminInvite.safeParse(body);

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

    const inviteAdmin = await inviteCollegeAdmin(validatedFields.data);
    console.log(inviteAdmin);

    return NextResponse.json(
      {
        success: true,
        data: inviteAdmin,
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
