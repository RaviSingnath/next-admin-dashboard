import createClient from "@/lib/supabase/server";
import {
  TAcceptInvite,
  TSignIn,
  TResetPassword,
  TUpdatePassword,
} from "@/lib/validations/admin/college-schema";

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

export async function acceptInvite(data: TAcceptInvite) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Invalid invite");
  }

  const { data: invitation, error: invitationError } = await supabase
    .from("invitations")
    .select("*")
    .eq("email", user.email)
    .eq("status", "pending")
    .single();

  if (invitationError) {
    throw new Error("Invite not found.");
  }

  const { error: updateUserError } = await supabase.auth.updateUser({
    password: data.confirm_password,
  });

  if (updateUserError) {
    throw new Error("Error occured while updating the info.");
  }

  await supabase.from("profiles").insert({
    id: user.id,
    email: user.email,
    role: invitation.role,
    college_id: invitation.college_id,
    created_by: invitation.invited_by,
    full_name: data.full_name,
    is_active: true,
  });

  const invite = await supabase
    .from("invitations")
    .update({
      status: "accepted",
      accepted_at: new Date().toISOString(),
    })
    .eq("id", invitation.id);

  return invite;
}
