"use server";

import createClient from "@/lib/supabase/server";
import { EXPIRES_AT } from "./invite.constants";
import { InviteData } from "./invite.types";

export const createInvite = async (data: InviteData) => {
  const supabase = await createClient();

  return supabase.from("invitations").insert({
    email: data.invite_email,
    full_name: data.full_name,
    role: "college_admin",
    college_id: data.college_id,
    expires_at: EXPIRES_AT.toISOString(),
  });
};
