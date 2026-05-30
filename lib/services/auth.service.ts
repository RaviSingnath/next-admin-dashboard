import createClient from "@/lib/supabase/server";
import {
  TAcceptInvite,
  TSignIn,
  TResetPassword,
  TUpdatePassword,
} from "@/lib/validations/admin/college-schema";
import { Session } from "@supabase/supabase-js";
import { createAdminClient } from "../supabase/admin";

export async function signinUser(data: TSignIn) {
  const supabase = await createClient();

  const { data: singInData, error: signInError } =
    await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

  if (signInError) {
    throw new Error("Error occured while singing in.");
  }

  return singInData;
}

export async function signOut(): Promise<null> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message ?? "Signout failed. Please try again.");
  }

  return null;
}

export async function resetPassword(data: TResetPassword) {
  const supabase = await createClient();

  const { data: resetPassworddata, error } =
    await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${origin}/callback?next=/update-password`,
    });

  if (error) {
    throw new Error("Error occured while singing in.");
  }

  return resetPassworddata;
}

export async function updatePassword(data: TUpdatePassword) {
  const supabase = await createClient();

  const { data: updatePasswordData, error } = await supabase.auth.updateUser({
    password: data.confirm_password,
  });

  if (error) {
    throw new Error("Error occured while singing in.");
  }

  return updatePasswordData;
}

export async function acceptInvite(token: string) {
  const supabase = await createClient();
  const supabaseAdmin = createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    throw new Error("Your not authenticated.");
  }

  const { data: invitation, error: invitationError } = await supabaseAdmin
    .from("invitations")
    .select("*")
    .eq("email", user.email)
    .eq("token", token)
    .in("status", ["pending"])
    .order("created_at", { ascending: false })
    .gt("expires_at", new Date().toISOString())
    .limit(1)
    .maybeSingle();

  if (!invitation || invitationError) {
    throw new Error("Invite not found.");
  }

  const { error: profileError } = await supabaseAdmin.from("profiles").upsert(
    {
      id: user.id,
      email: user.email,
      role: invitation.role,
      college_id: invitation.college_id,
      department_id: invitation.department_id,
      created_by: invitation.invited_by,
      status: "active",
      full_name: invitation.full_name,
    },
    { onConflict: "id" },
  );

  if (profileError) {
    throw new Error(profileError.message);
  }

  const { data: invite, error: inviteError } = await supabaseAdmin
    .from("invitations")
    .update({
      status: "accepted",
      accepted_at: new Date().toISOString(),
      accepted_by: user.id,
    })
    .eq("id", invitation.id)
    .eq("token", token)
    .select()
    .single();

  if (inviteError) {
    throw new Error(inviteError.message);
  }

  return invite;
}
