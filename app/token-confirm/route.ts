import { NextRequest, NextResponse } from "next/server";
import createClient from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  const type = searchParams.get("type");
  const next = searchParams.get("next");
  const token_hash = searchParams.get("token");

  if (token_hash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type: type,
      token_hash,
    });

    if (!error) {
      return NextResponse.redirect(new URL(`${origin}${next}`, request.url));
    }
  }

  return NextResponse.redirect(
    new URL(`${origin}/login?error=invalid_invite`, request.url),
  );
}
