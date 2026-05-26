import { NextResponse } from "next/server";
import createClient from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");
  const type = searchParams.get("type");
  const token_hash = searchParams.get("token_hash");
  const next = searchParams.get("next") ?? "/";

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  const supabase = await createClient();

  if (code) {
    console.log("code: ", code);
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);
    console.log("error: ", error);
    console.log("data: ", data);

    if (error) {
      return NextResponse.redirect(`${origin}/login?error=expired_link`);
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}
