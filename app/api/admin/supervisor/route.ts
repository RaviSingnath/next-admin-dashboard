import { NextResponse } from "next/server";
import { zSupervisorInvite } from "@/features/supervisors/supervisors.schema";
import { getZodFieldErrors } from "@/lib/helper/get-zod-field-errors";
import AppError from "@/lib/errors/app-error";
import { inviteSupervisor } from "@/lib/services/supervisors.services";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validatedFields = zSupervisorInvite.safeParse(body);

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

    const inviteAdmin = await inviteSupervisor(validatedFields.data);

    return NextResponse.json(
      {
        success: true,
        data: inviteAdmin,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);

    if (error instanceof AppError) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
          code: error.code,
        },
        {
          status: error.statusCode,
        },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      },
      { status: 500 },
    );
  }
}
