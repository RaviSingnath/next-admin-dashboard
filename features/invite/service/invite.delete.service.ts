import { getInviteForDeleteOrThrow } from "../invite.queries";
import { Errors } from "@/lib/errors/error-factory";
import { createAdminClient } from "@/lib/supabase/admin";
import { softDeleteInviteMutation } from "../invite.mutations";
import { Invitation } from "../invite.types";
import { RequestContext } from "@/lib/auth/request-context";
import { getDeletePermissions } from "../invite.rbac";
import { INVITATION_STATUS } from "../invite.constants";
import {
  assertCanDelete,
  assertInviteIsDeletable,
  assertDeleteCollegeScope,
  assertDeleteDepartmentScope,
  assertDeleteRoleHierarchy,
  assertDeleteOwnership,
  assertNotSelfDelete,
} from "../security/invite.delete.security";

async function tryDeleteUnconfirmedAuthUser(
  id: string,
  supabaseAdmin: ReturnType<typeof createAdminClient>,
): Promise<void> {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.getUserById(id);

    // No auth user found — nothing to clean up
    if (error || !data.user) return;

    const authUser = data.user;

    // Double safety: never delete a user who has confirmed their email
    // or who has ever signed in, even if they somehow ended up here
    if (
      authUser.email_confirmed_at !== null ||
      authUser.last_sign_in_at !== null
    ) {
      return;
    }

    await supabaseAdmin.auth.admin.deleteUser(authUser.id);
  } catch {
    // Swallow all errors — auth cleanup is best-effort.
    // The soft delete on the invitations row has already committed;
    // a transient Supabase Auth API failure must not roll it back.
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Delete invite service
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Soft-deletes an invitation and, for pending invites only, attempts to
 * clean up the associated unconfirmed Supabase Auth user.
 *
 * Security check order:
 *   1. Permission Gate       — fail before any DB call
 *   2. Invite Existence      — fetch once; all checks below use this record
 *   3. Already-deleted Guard — detect re-deletion attempts
 *   4. Status Guard          — only pending/revoked/expired/cancelled
 *   5. College Scope         — tenant isolation
 *   6. Department Scope      — supervisor is dept-locked
 *   7. Role Hierarchy        — prevent privilege escalation
 *   8. Ownership Check       — supervisor can only delete own invites
 *   9. Self-invite Guard     — cannot delete your own invite
 *  10. Soft delete           — primary DB operation; audit trigger fires
 *  11. Auth cleanup          — best-effort side effect (pending only)
 */
export const deleteInviteService = async ({
  ctx,
  inviteID,
}: {
  ctx: RequestContext;
  inviteID: string;
}): Promise<Invitation> => {
  const supabaseAdmin = createAdminClient();
  const { user } = ctx;
  const permissions = getDeletePermissions(user);

  // 1. Permission Gate — fail before any DB call
  assertCanDelete(user, permissions);

  // 2. Invite Existence — fetch once with delete projection (includes
  //    deleted_at needed for the already-deleted guard)
  const invite = await getInviteForDeleteOrThrow(inviteID);

  // 3 + 4. Already-deleted Guard + Status Guard (combined)
  assertInviteIsDeletable(invite);

  // 5. College Scope
  assertDeleteCollegeScope(user, invite);

  // 6. Department Scope (supervisor only)
  assertDeleteDepartmentScope(user, invite);

  // 7. Role Hierarchy
  assertDeleteRoleHierarchy(user, invite);

  // 8. Ownership Check (supervisor only — DELETE_OWN_INVITE)
  assertDeleteOwnership(user, invite, permissions);

  // 9. Self-invite Guard
  assertNotSelfDelete(user, invite);

  // 10. Soft delete — primary operation; audit trigger fires automatically
  const { data: deleted, error: deleteError } = await softDeleteInviteMutation(
    invite.id,
    user.id,
  );

  if (deleteError || !deleted) {
    throw Errors.database();
  }

  // 11. Auth cleanup — best-effort, scoped to pending invites only.
  //     Executed AFTER the soft delete commits so a cleanup failure
  //     cannot roll back the primary operation.
  //     Revoked / expired / cancelled invites are excluded because their
  //     associated auth users may be in a state we should not disturb.
  if (invite.status === INVITATION_STATUS.PENDING) {
    await tryDeleteUnconfirmedAuthUser(invite.id, supabaseAdmin);
  }

  return deleted;
};
