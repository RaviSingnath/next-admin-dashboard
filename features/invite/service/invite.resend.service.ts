import { getInviteForResendOrThrow } from "../invite.queries";
import { Errors } from "@/lib/errors/error-factory";
import { createAdminClient } from "@/lib/supabase/admin";
import { resendInviteMutation } from "../invite.mutations";
import { generateToken } from "@/lib/helper/generate-token";
import { Invitation } from "../invite.types";
import { mapSupabaseAuthError } from "@/lib/errors/supabase-auth-error";
import { RequestContext } from "@/lib/auth/request-context";
import { getResendPermissions } from "../invite.rbac";
import {
  assertCanResend,
  assertInviteIsResendable,
  assertResendCollegeScope,
  assertResendDepartmentScope,
  assertResendRoleHierarchy,
  assertResendOwnership,
  assertNotSelfResend,
} from "../security/invite.resend.security";
import { currentDate, getExpiresAtDate } from "@/lib/helper/date";

/**
 * Resend invite service
 **/

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
