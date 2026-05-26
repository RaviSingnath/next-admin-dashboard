import { NextResponse } from "next/server";
import { deleteDepartmentService } from "@/lib/services/depatments.service";

export async function DELETE(
  _: Request,
  {
    params,
  }: {
    params: Promise<{ departmentId: string }>;
  },
) {
  try {
    const { departmentId } = await params;

    if (!departmentId) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: "Department ID not found",
        },
        { status: 400 },
      );
    }

    const result = await deleteDepartmentService(departmentId);

    return NextResponse.json(
      {
        success: true,
        message: "Department deleted successfully",
        data: result,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete department";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      {
        status: 400,
      },
    );
  }
}
