import {
  getInviteById,
  getInviteOrThrow,
  getInvitesQuery,
} from "./invite.queries";
import { Errors } from "@/lib/errors/error-factory";

import { createAdminClient } from "@/lib/supabase/admin";
import { getInviteByEmail } from "../invite/invite.queries";
import UserRole from "@/lib/rbac/roles";
import {
  cancelOlderInviteByEmail,
  createInvite,
  revokeInviteMutation,
} from "../invite/invite.mutations";
import { generateToken } from "@/lib/helper/generate-token";
import { Invitation, StudentInvite } from "../invite/invite.types";
import { mapSupabaseAuthError } from "@/lib/errors/supabase-auth-error";
import { TInvitePayload } from "../invite/invite.schema";
import { mapSupabaseError } from "@/lib/errors/supabase-error";
import {
  createRequestContext,
  RequestContext,
} from "@/lib/auth/request-context";
import { assertCanInvite } from "./invite.security";
import { getRevokePermissions } from "./invite.rbac";
import {
  assertCanRevoke,
  assertInviteIsRevocable,
  assertRevokeCollegeScope,
  assertRevokeRoleHierarchy,
  assertRevokeOwnership,
  assertNotSelfRevoke,
} from "./invite.security";

export async function getInvitesService() {
  const ctx = await createRequestContext();

  const { data, error } = await getInvitesQuery(ctx.user);

  if (error) {
    throw mapSupabaseError(error);
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

export async function resendInviteService({ inviteID }: { inviteID: string }) {
  const supabaseAdmin = createAdminClient();

  const { data: oldInvite, error } = await getInviteById(inviteID);

  if (error) {
    throw mapSupabaseError(error);
  }

  if (!oldInvite) {
    throw Errors.notFound("Old invite not found");
  }

  const token = generateToken();
  const inviteUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/accept-invite?token=${token}`;

  const { data, error: resendInviteError } =
    await supabaseAdmin.auth.admin.generateLink({
      type: "invite",
      email: oldInvite.email,
      options: {
        redirectTo: inviteUrl,
      },
    });

  if (resendInviteError) {
    throw mapSupabaseAuthError(resendInviteError);
  }

  // TODO: send invite link via email (e.g. Resend)
  // await resend.emails.send({ ... })
  const inviteLink = data.properties.action_link;

  return data.user;
}

export const revokeInviteService = async ({
  ctx,
  inviteID,
}: {
  ctx: RequestContext;
  inviteID: string;
}): Promise<Invitation> => {
  const { user } = ctx;
  const permissions = getRevokePermissions(user);

  // 1. Permission Gate — fail before any DB call
  assertCanRevoke(user, permissions);

  // 2. Invite Existence — fetch once; all checks below use this record
  const invite = await getInviteOrThrow(inviteID);

  // 3. Status Guard
  assertInviteIsRevocable(invite);

  // 4. College Scope
  assertRevokeCollegeScope(user, invite);

  // 5. Role Hierarchy
  assertRevokeRoleHierarchy(user, invite);

  // 6. Ownership Check
  assertRevokeOwnership(user, invite, permissions);

  // 7. Self-invite Guard
  assertNotSelfRevoke(user, invite);

  // 8. Update — audit trigger fires automatically on this UPDATE
  const { data: revoked, error: updateError } = await revokeInviteMutation(
    invite.id,
    user.id,
  );

  if (updateError || !revoked) {
    throw Errors.database();
  }

  return revoked;
};
