import { AppError } from "@/lib/app-error";
import { getInviteByEmail } from "../invite/invite.queries";
import {
  getCollegeAdminsQuery,
  getCreatorByIdsQuery,
} from "./college-admin.queries";
import { TCollegeAdminInvite } from "./college-admin.schema";
import { getCurrentUserServer } from "@/lib/autth/getCurrentUserServer";
import { createAdminClient } from "@/lib/supabase/admin";
import UserRole from "@/lib/rbac/roles";
import { CollegeAdminInvite } from "../invite/invite.types";
import { createInvite } from "../invite/invite.mutations";
import { generateToken } from "@/lib/helper/generate-token";

export const getCollegeAdminsService = async () => {
  const query = getCollegeAdminsQuery();

  const { data, error } = await query;

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

  const { data: creators, error: creatorsError } =
    await getCreatorByIdsQuery(creatorIds);

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
};

export const inviteCollegeAdminService = async (data: TCollegeAdminInvite) => {
  const supabaseAdmin = createAdminClient();

  const { data: existingInvite } = await getInviteByEmail(data.invite_email);

  if (existingInvite) {
    throw new AppError("Invitation already exists", 409, "INVITATION_EXISTS");
  }

  const user = await getCurrentUserServer();

  if (!user) {
    throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
  }

  if (user?.role !== "super_admin") {
    throw new AppError("Forbidden", 403, "FORBIDDEN");
  }

  const token = generateToken();

  const inviteUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/accept-invite?token=${token}`;

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

  const inviteData: CollegeAdminInvite = {
    email: data.invite_email,
    full_name: data.full_name,
    token: token,
    role: UserRole.COLLEGE_ADMIN,
    college_id: data.college_id,
  };

  const { data: invitation, error } = await createInvite(inviteData);

  if (error) {
    throw new AppError(error.message, 400, error.code || "DATABASE_ERROR");
  }

  return invitation;
};
