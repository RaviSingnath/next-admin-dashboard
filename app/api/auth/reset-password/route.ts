import { NextResponse } from "next/server";
import createClient from "@/lib/supabase/server";

export async function POST(request: Request) {
  const { origin } = new URL(request.url);

  const supabase = await createClient();

  const { email } = await request.json();

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/callback?next=/update-password`,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    data,
  });
}
