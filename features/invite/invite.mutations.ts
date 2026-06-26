"use server";

import createClient from "@/lib/supabase/server";
import { EXPIRES_AT } from "./invite.constants";
import { InvitationInsert, InviteData } from "./invite.types";

export const createInvite = async (data: InviteData) => {
  const supabase = await createClient();

  const inviteData: InvitationInsert = {
    ...data,
    expires_at: EXPIRES_AT.toISOString(),
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
