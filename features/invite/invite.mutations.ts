"use server";

import createClient from "@/lib/supabase/server";
import { InvitationInsert, InviteData } from "./invite.types";

export const createInvite = async (data: InviteData, expiresAt: string) => {
  const supabase = await createClient();

  const inviteData: InvitationInsert = {
    ...data,
    expires_at: expiresAt,
  };

  return supabase.from("invitations").insert(inviteData);
};

export const cancelOlderInviteByEmail = async (email: string) => {
  const supabase = await createClient();

  return supabase
    .from("invitations")
    .update({
      status: "cancelled",
    })
    .eq("email", email)
    .in("status", ["pending", "onboarding"]);
};

export const revokeInviteMutation = async (
  inviteID: string,
  userID: string,
) => {
  const supabase = await createClient();

  return supabase
    .from("invitations")
    .update({
      status: "revoked",
      revoked_by: userID,
      revoked_at: new Date().toISOString(),
    })
    .eq("id", inviteID)
    .select()
    .single();
};

// ─────────────────────────────────────────────────────────────────────────────
// Resend mutation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Rotates the token and resets expires_at on an existing invitation row.
 *
 * Called after generateLink() succeeds so the DB stays in sync with
 * Supabase Auth. The audit trigger fires automatically on this UPDATE.
 *
 * Status is intentionally left as 'pending' — resending an expired invite
 * does not change its lifecycle state, only refreshes the credentials.
 */
export const resendInviteMutation = async (
  inviteID: string,
  token: string,
  expiresAt: string,
) => {
  const supabase = await createClient();

  return supabase
    .from("invitations")
    .update({
      token,
      expires_at: expiresAt,
    })
    .eq("id", inviteID)
    .select()
    .single();
};

// ─────────────────────────────────────────────────────────────────────────────
// Soft delete mutation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Soft-deletes an invitation by stamping deleted_at and deleted_by.
 *
 * Status is intentionally left unchanged — preserving the status means
 * the lifecycle history (pending → revoked → deleted, or pending → deleted)
 * remains readable in audit logs. The row is hidden from normal queries
 * via the WHERE deleted_at IS NULL filter in getInvitesQuery.
 *
 * The audit trigger fires automatically on this UPDATE.
 */
export const softDeleteInviteMutation = async (
  inviteID: string,
  userID: string,
) => {
  const supabase = await createClient();

  return supabase
    .from("invitations")
    .update({
      deleted_at: new Date().toISOString(),
      deleted_by: userID,
    })
    .eq("id", inviteID)
    .select()
    .single();
};
