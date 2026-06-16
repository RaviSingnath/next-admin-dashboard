import AppError from "@/lib/errors/app-error";
import { getCurrentUserServer } from "@/lib/autth/getCurrentUserServer";
import { getStudentsQuery } from "./students.queries";
import { getCreatorByIdsQuery } from "../college-admins/college-admin.queries";
import { TStudentInvite } from "./students.schema";
import { createAdminClient } from "@/lib/supabase/admin";
import { getInviteByEmail } from "../invite/invite.queries";
import UserRole from "@/lib/rbac/roles";
import {
  cancelOlderInviteByEmail,
  createInvite,
} from "../invite/invite.mutations";
import { generateToken } from "@/lib/helper/generate-token";
import { StudentInvite } from "../invite/invite.types";

export async function getStudentsService() {
  const profile = await getCurrentUserServer();

  if (!profile) {
    throw new AppError("Profile not found", 403, "NOT_FOUND");
  }

  const { data: students, error } = await getStudentsQuery(profile);

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

  const { data: creators, error: creatorsError } =
    await getCreatorByIdsQuery(creatorIds);

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

export async function inviteStudentService(data: TStudentInvite) {
  const supabaseAdmin = createAdminClient();

  const { data: existingInvite } = await getInviteByEmail(data.invite_email);

  if (existingInvite) {
    throw new AppError("Invitation already exists", 409, "INVITATION_EXISTS");
  }

  const profile = await getCurrentUserServer();

  if (profile?.role !== UserRole.SUPERVISOR) {
    throw new AppError("Forbidden", 403, "FORBIDDEN");
  }

  // Invalidate older invites automatically for email reuse
  const { error: revokeOldInviteError } = await cancelOlderInviteByEmail(
    data.invite_email,
  );

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

  const inviteData: StudentInvite = {
    email: data.invite_email,
    full_name: data.full_name,
    role: UserRole.STUDENT,
    token: token,
    college_id: data.college_id,
    department_id: data.department_id,
  };

  const { data: invitation, error } = await createInvite(inviteData);

  if (error) {
    throw new AppError(error.message, 400, error.code || "DATABASE_ERROR");
  }

  return invitation;
}
