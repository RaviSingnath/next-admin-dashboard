import { NextResponse } from "next/server";
import createClient from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();

  const { email, password } = await req.json();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
  });
}
