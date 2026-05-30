import { NextResponse } from "next/server";
import z4 from "zod/v4";
import { AppError } from "@/lib/app-error";
import { softDeleteUser } from "@/lib/services/super-admin.service";

type RouteParams = {
  params: {
    id: string;
  };
};

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!id) {
      throw new AppError("User ID is required", 400, "VALIDATION_ERROR");
    }

    const deletedUser = await softDeleteUser(id);

    return NextResponse.json(
      {
        success: true,
        message: "User deleted successfully",
        data: deletedUser,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
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

    console.error("DELETE_USER_API_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      },
      {
        status: 500,
      },
    );
  }
}
