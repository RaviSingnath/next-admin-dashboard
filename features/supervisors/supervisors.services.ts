"use server";

import { getCurrentUserServer } from "@/lib/autth/getCurrentUserServer";
import { TSupervisorInvite } from "./supervisors.schema";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateToken } from "@/lib/helper/generate-token";
import { getSupervisorsQuery } from "./supervisors.queries";
import { getCreatorByIdsQuery } from "../college-admins/college-admin.queries";
import { getInviteByEmail } from "../invite/invite.queries";
import {
  cancelOlderInviteByEmail,
  createInvite,
} from "../invite/invite.mutations";
import UserRole from "@/lib/rbac/roles";
import { SupervisorInvite } from "../invite/invite.types";
import { mapSupabaseError } from "@/lib/errors/supabase-error";
import { Errors } from "@/lib/errors/error-factory";
import { mapSupabaseAuthError } from "@/lib/errors/supabase-auth-error";

export async function getSupervisorsService() {
  const { data: supervisors, error } = await getSupervisorsQuery();

  if (error) {
    throw mapSupabaseError(error);
  }

  if (!supervisors?.length) {
    return [];
  }

  const creatorIds = [
    ...new Set(
      supervisors
        .map((row) => row.created_by)
        .filter((id): id is string => !!id),
    ),
  ];

  if (creatorIds.length === 0) {
    return supervisors.map((row) => ({ ...row, creator: null }));
  }

  const { data: creators, error: creatorsError } =
    await getCreatorByIdsQuery(creatorIds);

  if (creatorsError) {
    throw mapSupabaseError(creatorsError);
  }

  const creatorsById = new Map(
    creators?.map((creator) => [creator.id, creator]) ?? [],
  );

  return supervisors.map((row) => ({
    ...row,
    creator: row.created_by ? (creatorsById.get(row.created_by) ?? null) : null,
  }));
}
export type SupervisorsListResponse = Awaited<
  ReturnType<typeof getSupervisorsService>
>;

export type SupervisorsListItem = SupervisorsListResponse[number];

export async function inviteSupervisorService(data: TSupervisorInvite) {
  const supabaseAdmin = createAdminClient();

  const { data: existingInvite } = await getInviteByEmail(data.invite_email);

  if (existingInvite) {
    throw Errors.alreadyExists("Invitation already exists");
  }

  const profile = await getCurrentUserServer();

  if (profile?.role !== "college_admin") {
    throw Errors.forbidden();
  }

  // Invalidate older invites automatically for email reuse
  const { error: revokeOldInviteError } = await cancelOlderInviteByEmail(
    data.invite_email,
  );

  if (revokeOldInviteError) {
    throw mapSupabaseError(revokeOldInviteError);
  }

  const token = generateToken();
  const inviteUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/accept-invite?token=${token}`;

  const { error: inviteError } =
    await supabaseAdmin.auth.admin.inviteUserByEmail(data.invite_email, {
      redirectTo: inviteUrl,
      data: {
        full_name: data.full_name,
        role: "supervisor",
        college_id: data.college_id,
        department_id: data.department_id,
      },
    });

  if (inviteError) {
    throw mapSupabaseAuthError(inviteError);
  }

  const inviteData: SupervisorInvite = {
    email: data.invite_email,
    full_name: data.full_name,
    role: UserRole.SUPERVISOR,
    token: token,
    college_id: data.college_id,
    department_id: data.department_id,
  };

  const { data: invitation, error } = await createInvite(inviteData);

  if (error) {
    throw mapSupabaseError(error);
  }

  return invitation;
}
