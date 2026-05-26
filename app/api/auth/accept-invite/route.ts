import { NextResponse } from "next/server";
import { acceptInvite } from "@/lib/services/auth.service";

export async function GET() {
  try {
    const acceptedInvite = await acceptInvite();

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
