"use server";

import { CurrentUserServer } from "@/lib/autth/getCurrentUserServer";
import createClient from "@/lib/supabase/server";

export const getInvitesQuery = async (profile: CurrentUserServer) => {
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
