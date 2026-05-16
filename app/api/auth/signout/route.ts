import { NextResponse } from "next/server";
import { signOut } from "@/lib/services/auth.service";

export async function POST() {
  try {
    await signOut();

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Signout failed. Please try again.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
