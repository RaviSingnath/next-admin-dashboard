import createClient from "@/lib/supabase/server";
import { AppError } from "@/lib/app-error";

export async function getInvites() {
  const supabase = await createClient();

  const query = supabase
    .from("invitations")
    .select(
      `
    id,
    email,
    role,
    status,
    expires_at,
    accepted_at,
    created_at,

    college:colleges (
      id,
      college_name
    ),

    invited_by_profile:profiles!invited_by (
      id,
      full_name,
      email
    ),
    
    created_user_profile:profiles!accepted_by (
      id
    )
  `,
    )
    .order("created_at", { ascending: false });

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data;
}
export type InvitesListResponse = Awaited<ReturnType<typeof getInvites>>;

export type InvitesListItem = InvitesListResponse[number];

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
