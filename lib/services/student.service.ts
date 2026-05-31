import createClient from "@/lib/supabase/server";
import { getProfile } from "./helper/getProfile";
import { AppError } from "../app-error";
import { TStudentInvite } from "../validations/admin/college-schema";
import { createAdminClient } from "../supabase/admin";
import { generateToken } from "../helper/generate-token";
import UserRole from "../rbac/roles";

export async function inviteStudent(data: TStudentInvite) {
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

  const profile = await getProfile();

  if (profile?.role !== UserRole.SUPERVISOR) {
    throw new AppError("Forbidden", 403, "FORBIDDEN");
  }

  // Invalidate older invites automatically for email reuse
  const { error: revokeOldInviteError } = await supabase
    .from("invitations")
    .update({
      status: "cancelled",
    })
    .eq("email", data.invite_email)
    .in("status", ["pending", "onboarding"]);

  if (revokeOldInviteError) {
    throw new Error(revokeOldInviteError.message);
  }

  const token = generateToken();
  const inviteUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/accept-invite?token=${token}`;

  const { error: inviteError } =
    await supabaseAdmin.auth.admin.inviteUserByEmail(data.invite_email, {
      redirectTo: inviteUrl,
      data: {
        full_name: data.full_name,
        role: UserRole.STUDENT,
        college_id: data.college_id,
        department_id: data.department_id,
      },
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
      role: UserRole.STUDENT,
      token: token,
      college_id: data.college_id,
      department_id: data.department_id,
      expires_at: expiresAt.toISOString(),
    });

  if (error) {
    throw new AppError(error.message, 400, error.code || "DATABASE_ERROR");
  }

  return invitation;
}

export async function getStudentsService() {
  const supabase = await createClient();

  const profile = await getProfile();

  if (!profile?.college_id || !profile?.department_id) {
    throw new AppError("Profile not found", 403, "NOT_FOUND");
  }

  const { data: students, error } = await supabase
    .from("profiles")
    .select(
      `
    id,
    full_name,
    email,
    status,
    created_at,
    deleted_at,
    created_by
  `,
    )
    .order("created_at", { ascending: false })
    .eq("college_id", profile.college_id)
    .eq("department_id", profile.department_id)
    .eq("role", UserRole.STUDENT);

  if (error) {
    throw error;
  }

  if (!students?.length) {
    return [];
  }

  const creatorIds = [
    ...new Set(
      students.map((row) => row.created_by).filter((id): id is string => !!id),
    ),
  ];

  if (creatorIds.length === 0) {
    return students.map((row) => ({ ...row, creator: null }));
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

  return students.map((row) => ({
    ...row,
    creator: row.created_by ? (creatorsById.get(row.created_by) ?? null) : null,
  }));
}
export type StudentsListResponse = Awaited<
  ReturnType<typeof getStudentsService>
>;

export type StudentsListItem = StudentsListResponse[number];
