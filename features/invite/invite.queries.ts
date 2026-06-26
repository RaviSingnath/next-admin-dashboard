"use server";

import { AuthUser } from "@/lib/auth/types";
import createClient from "@/lib/supabase/server";
import { QueryData } from "@supabase/supabase-js";
import { Errors } from "@/lib/errors/error-factory";

export const getInvitesQuery = async (profile: AuthUser) => {
  const supabase = await createClient();

  let query = supabase
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

    department:departments (
      id,
      department_name
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

  if (profile?.college_id) {
    query = query.eq("college_id", profile.college_id);
  }

  if (profile?.department_id) {
    query = query.eq("department_id", profile.department_id);
  }

  return query;
};

export const getInviteByEmail = async (inviteEmail: string) => {
  const supabase = await createClient();

  return supabase
    .from("invitations")
    .select("id")
    .eq("email", inviteEmail)
    .maybeSingle();
};

export const getInviteById = async (id: string) => {
  const supabase = await createClient();

  return supabase
    .from("invitations")
    .select("id, email, status, college_id, role, invited_by")
    .eq("id", id)
    .single();
};

export type GetInviteByIdResult = QueryData<ReturnType<typeof getInviteById>>;

/**
 * Fetches an invite by ID and throws a typed 404 if it does not exist.
 *
 * Use this in services where a missing invite is always an error.
 * Use getInviteById directly when you need to handle the missing case
 * yourself (e.g. conditional logic before throwing).
 */
export async function getInviteOrThrow(
  id: string,
): Promise<GetInviteByIdResult> {
  const { data: invite, error } = await getInviteById(id);

  if (error || !invite) {
    throw Errors.notFound("Invite not found");
  }

  return invite;
}
