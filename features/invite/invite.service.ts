import { getCurrentUserServer } from "@/lib/auth/getCurrentUserServer";
import { getInvitesQuery } from "./invite.queries";
import { Errors } from "@/lib/errors/error-factory";

import { createAdminClient } from "@/lib/supabase/admin";
import { getInviteByEmail } from "../invite/invite.queries";
import UserRole from "@/lib/rbac/roles";
import {
  cancelOlderInviteByEmail,
  createInvite,
} from "../invite/invite.mutations";
import { generateToken } from "@/lib/helper/generate-token";
import { StudentInvite } from "../invite/invite.types";
import { mapSupabaseAuthError } from "@/lib/errors/supabase-auth-error";
import { TInvitePayload } from "../invite/invite.schema";
import { mapSupabaseError } from "@/lib/errors/supabase-error";
import { RequestContext } from "@/lib/auth/request-context";
import { assertCanInvite } from "./invite.security";

export async function getInvitesService() {
  const profile = await getCurrentUserServer();

  if (!profile) {
    throw Errors.forbidden();
  }

  const { data, error } = await getInvitesQuery(profile);

  if (error) {
    throw error;
  }

  return data;
}
export type InvitesListResponse = Awaited<ReturnType<typeof getInvitesService>>;

export type InvitesListItem = InvitesListResponse[number];

type InviteUserServiceInput = {
  ctx: RequestContext;
  data: TInvitePayload;
};

export async function inviteUserService({ ctx, data }: InviteUserServiceInput) {
  const supabaseAdmin = createAdminClient();

  assertCanInvite(ctx, data);

  const { data: existingInvite } = await getInviteByEmail(data.invite_email);

  if (existingInvite) {
    throw Errors.alreadyExists("Invitation already exists");
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
        role: UserRole.STUDENT,
        college_id: data.college_id,
        department_id: data.department_id,
      },
    });

  if (inviteError) {
    throw mapSupabaseAuthError(inviteError);
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
    throw mapSupabaseError(error);
  }

  return invitation;
}
