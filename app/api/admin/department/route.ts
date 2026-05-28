import { getZodErrors } from "@/lib/helper/get-zod-errors";
import { zAddDepartment } from "@/lib/validations/admin/college-schema";
import { NextResponse } from "next/server";
import {
  createDepartmentService,
  getDepartmentsService,
} from "@/lib/services/depatments.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validatedFields = zAddDepartment.safeParse(body);

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

    const department = await createDepartmentService(validatedFields.data);

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

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const filters = {
    includeDeleted: searchParams.get("includeDeleted"),
  };

  const result = await getDepartmentsService(filters);

  return result;
}
