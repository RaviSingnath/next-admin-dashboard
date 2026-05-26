import createClient from "@/lib/supabase/server";

export async function GET() {
  const supabase = createClient();

  console.log("asdadad: ", (await supabase).auth.getUser());
}
