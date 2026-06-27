import {
  getInviteOrThrow,
  getInviteForResendOrThrow,
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
  resendInviteMutation,
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
import { getRevokePermissions, getResendPermissions } from "./invite.rbac";
import {
  assertCanRevoke,
  assertInviteIsRevocable,
  assertRevokeCollegeScope,
  assertRevokeRoleHierarchy,
  assertRevokeOwnership,
  assertNotSelfRevoke,
  assertCanResend,
  assertInviteIsResendable,
  assertResendCollegeScope,
  assertResendDepartmentScope,
  assertResendRoleHierarchy,
  assertResendOwnership,
  assertNotSelfResend,
} from "./invite.security";
import { currentDate, getExpiresAtDate } from "@/lib/helper/date";

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

  const { data: invitation, error } = await createInvite(
    inviteData,
    getExpiresAtDate(),
  );

  if (error) {
    throw mapSupabaseError(error);
  }

  return invitation;
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

// ─────────────────────────────────────────────────────────────────────────────
// Resend invite service
// ─────────────────────────────────────────────────────────────────────────────

export const resendInviteService = async ({
  ctx,
  inviteID,
}: {
  ctx: RequestContext;
  inviteID: string;
}): Promise<Invitation> => {
  const supabaseAdmin = createAdminClient();
  const { user } = ctx;
  const permissions = getResendPermissions(user);

  // 1. Permission Gate — fail before any DB call
  assertCanResend(user, permissions);

  // 2. Invite Existence — fetch once with resend projection (includes
  //    department_id and expires_at needed for checks below)
  const invite = await getInviteForResendOrThrow(inviteID);

  // 3. Status + Expiry Guard (combined)
  //    Status must be 'pending' AND expires_at must be in the past
  assertInviteIsResendable(invite, currentDate());

  // 4. College Scope
  assertResendCollegeScope(user, invite);

  // 5. Department Scope (supervisor only)
  assertResendDepartmentScope(user, invite);

  // 6. Role Hierarchy
  assertResendRoleHierarchy(user, invite);

  // 7. Ownership Check (supervisor only — RESEND_OWN_INVITE)
  assertResendOwnership(user, invite, permissions);

  // 8. Self-invite Guard
  assertNotSelfResend(user, invite);

  // 9. Generate a new invite link via Supabase Admin
  //    generateLink with type "invite" works on users already created by
  //    the original inviteUserByEmail call. It rotates the magic-link
  //    token without creating a new user record.
  const newToken = generateToken();
  const inviteUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/accept-invite?token=${newToken}`;

  const { error: generateLinkError } =
    await supabaseAdmin.auth.admin.generateLink({
      type: "invite",
      email: invite.email,
      options: {
        redirectTo: inviteUrl,
      },
    });

  if (generateLinkError) {
    throw mapSupabaseAuthError(generateLinkError);
  }

  // TODO: deliver the invite link via email (e.g. Resend / Postmark)
  // await mailer.send({ to: invite.email, inviteUrl })

  // 10. Rotate token + reset expires_at in the invitations row.
  //     This keeps the DB in sync with the Supabase Auth token that was
  //     just generated. The audit trigger fires automatically on this UPDATE.
  const newExpiresAt = getExpiresAtDate();

  const { data: updated, error: updateError } = await resendInviteMutation(
    invite.id,
    newToken,
    newExpiresAt,
  );

  if (updateError || !updated) {
    throw Errors.database();
  }

  return updated;
};
