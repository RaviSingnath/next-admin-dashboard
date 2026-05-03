import { NextResponse } from "next/server";
import createClient from "@/lib/supabase/server";

export async function POST(request: Request) {
  const { origin } = new URL(request.url);

  const supabase = await createClient();

  const { password } = await request.json();

  const { data, error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Force re-auth: After exchangeCodeForSession. Prevents session fixation issues.
  await supabase.auth.signOut();

  return NextResponse.redirect(`${origin}/login`);
}
