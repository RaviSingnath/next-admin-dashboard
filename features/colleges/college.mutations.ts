import createClient from "@/lib/supabase/server";
import { TCollege } from "./college.schema";

export const createCollegeMutation = async (data: TCollege) => {
  const supabase = await createClient();

  return supabase.from("colleges").insert(data).select().single();
};
