import createClient from "@/lib/supabase/server";
import { createAdminClient } from "../supabase/admin";
import { QueryData } from "@supabase/supabase-js";
import type { TCollegeAdminInvite } from "@/lib/validations/admin/college-schema";
import { AppError } from "@/lib/app-error";

export async function inviteCollegeAdmin(data: TCollegeAdminInvite) {
  const supabase = await createClient();
  const supabaseAdmin = createAdminClient();

  const { data: existingInvite } = await supabase
    .from("invitations")
    .select("id")
    .eq("email", data.invite_email)
    .maybeSingle();

  if (existingInvite) {
    throw new AppError("Invitation already exists", 409, "INVITATION_EXISTS");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "super_admin") {
    throw new AppError("Forbidden", 403, "FORBIDDEN");
  }

  const inviteUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/accept-invite`;
  // const toeknConfirmUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/token-confirm?next=/accept-invite`;

  const { error: inviteError } =
    await supabaseAdmin.auth.admin.inviteUserByEmail(data.invite_email, {
      redirectTo: inviteUrl,
      data: { full_name: data.full_name },
    });

  if (inviteError) {
    throw new AppError(
      inviteError.message,
      400,
      inviteError.code || "INVITE_ERROR",
    );
  }

  const expiresAt = new Date(Date.now() + 3600 * 1000);

  const { data: invitation, error } = await supabase
    .from("invitations")
    .insert({
      email: data.invite_email,
      full_name: data.full_name,
      role: "college_admin",
      college_id: data.college_id,
      expires_at: expiresAt.toISOString(),
    });

  if (error) {
    throw new AppError(error.message, 400, error.code || "DATABASE_ERROR");
  }

  return invitation;
}

export async function getCollegeAdmins() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select(
      `
    id,
    full_name,
    email,
    status,
    created_at,
    deleted_at,
    created_by,

    college:colleges (
      id,
      college_name
    )
  `,
    )
    .order("created_at", { ascending: false })
    .eq("role", "college_admin");

  if (error) {
    throw error;
  }

  if (!data?.length) {
    return [];
  }

  const creatorIds = [
    ...new Set(
      data.map((row) => row.created_by).filter((id): id is string => !!id),
    ),
  ];

  if (creatorIds.length === 0) {
    return data.map((row) => ({ ...row, creator: null }));
  }

  const { data: creators, error: creatorsError } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in("id", creatorIds);

  if (creatorsError) {
    throw creatorsError;
  }

  const creatorsById = new Map(
    creators?.map((creator) => [creator.id, creator]) ?? [],
  );

  return data.map((row) => ({
    ...row,
    creator: row.created_by ? (creatorsById.get(row.created_by) ?? null) : null,
  }));
}
export type CollegeAdminsListResponse = Awaited<
  ReturnType<typeof getCollegeAdmins>
>;

export type CollegeAdminListItem = CollegeAdminsListResponse[number];

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
