import createClient from "@/lib/supabase/server";
import AppError from "@/lib/errors/app-error";

export async function softDeleteUser(userID: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("soft_delete_profile", {
    p_user_id: userID,
  });

  if (error) {
    throw new AppError(error.message, 400, "SOFT_DELETE_FAILED");
  }

  return data;
}
