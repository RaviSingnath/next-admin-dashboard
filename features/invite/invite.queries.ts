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
    .is("deleted_at", null)
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

// ─────────────────────────────────────────────────────────────────────────────
// Resend-specific query
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetches the fields needed for all resend security checks.
 *
 * Extends the base getInviteById projection with department_id and
 * expires_at, which are required for department scope and expiry checks
 * respectively. A separate query avoids changing getInviteById's return
 * type and breaking its existing callers (revokeInviteService etc.).
 */
export const getInviteForResend = async (id: string) => {
  const supabase = await createClient();

  return supabase
    .from("invitations")
    .select(
      "id, email, status, college_id, department_id, role, invited_by, expires_at",
    )
    .eq("id", id)
    .single();
};

export type GetInviteForResendResult = QueryData<
  ReturnType<typeof getInviteForResend>
>;

/**
 * Fetches the resend projection and throws a typed 404 if the row is missing.
 */
export async function getInviteForResendOrThrow(
  id: string,
): Promise<GetInviteForResendResult> {
  const { data: invite, error } = await getInviteForResend(id);

  if (error || !invite) {
    throw Errors.notFound("Invite not found");
  }

  return invite;
}

// ─────────────────────────────────────────────────────────────────────────────
// Delete-specific query
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetches the fields needed for all delete security checks.
 *
 * Includes deleted_at so assertInviteIsDeletable can detect rows that
 * have already been soft-deleted and return an informative error rather
 * than silently re-stamping them.
 *
 * Requires: migration 20260628000000_add_soft_delete_to_invitations.sql
 * and regenerated Supabase types before the deleted_at column resolves
 * correctly in the QueryData type.
 */
export const getInviteForDelete = async (id: string) => {
  const supabase = await createClient();

  return supabase
    .from("invitations")
    .select(
      "id, email, status, college_id, department_id, role, invited_by, deleted_at",
    )
    .eq("id", id)
    .single();
};

export type GetInviteForDeleteResult = QueryData<
  ReturnType<typeof getInviteForDelete>
>;

/**
 * Fetches the delete projection and throws a typed 404 if the row is missing.
 */
export async function getInviteForDeleteOrThrow(
  id: string,
): Promise<GetInviteForDeleteResult> {
  const { data: invite, error } = await getInviteForDelete(id);

  if (error || !invite) {
    throw Errors.notFound("Invite not found");
  }

  return invite;
}
