import { NextRequest, NextResponse } from "next/server";
import { acceptInvite } from "@/lib/services/auth.service";

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Token not found",
        },
        { status: 400 },
      );
    }

    const acceptedInvite = await acceptInvite(token);

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
        message:
          error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}
