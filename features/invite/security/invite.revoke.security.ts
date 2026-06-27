import UserRole from "@/lib/rbac/roles";
import type { AuthUser } from "@/lib/auth/types";

import { type RevokePermissions } from "../invite.rbac";
import { Errors } from "@/lib/errors/error-factory";
import type { GetInviteByIdResult } from "../invite.queries";
import {
  REVOCABLE_STATUSES,
  INVITATION_STATUS,
  COLLEGE_ADMIN_BLOCKED_ROLES,
  SUPERVISOR_BLOCKED_ROLES,
} from "../invite.constants";

// ─────────────────────────────────────────────────────────────────────────────
// Revoke invite security
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Check 1 — Permission Gate
 *
 * Fails before any DB call if the user holds neither
 * REVOKE_INVITE nor REVOKE_OWN_INVITE.
 */
export function assertCanRevoke(
  user: AuthUser,
  { canRevokeAny, canRevokeOwn }: RevokePermissions,
): void {
  if (!canRevokeAny && !canRevokeOwn) {
    throw Errors.forbidden("You do not have permission to revoke invites");
  }
}

/**
 * Check 3 — Status Guard
 *
 * Only pending / onboarding invites can be revoked.
 * Gives a specific message when the invite is already revoked
 * to distinguish it from other non-revocable states.
 */
export function assertInviteIsRevocable(invite: GetInviteByIdResult): void {
  if (
    !REVOCABLE_STATUSES.includes(
      invite.status as (typeof REVOCABLE_STATUSES)[number],
    )
  ) {
    throw Errors.conflict(
      invite.status === INVITATION_STATUS.REVOKED
        ? "This invite has already been revoked"
        : "This invite cannot be revoked in its current state",
    );
  }
}

/**
 * Check 4 — College Scope
 *
 * super_admin has no college_id and operates platform-wide — skipped.
 * college_admin and supervisor must share the invite's college.
 *
 * NOTE: Errors.collegeNotAssigned() is intentionally avoided here.
 * That factory method throws internally instead of returning, which
 * breaks TypeScript control flow analysis. Using Errors.forbidden()
 * directly until that inconsistency is fixed in the error factory.
 */
export function assertRevokeCollegeScope(
  user: AuthUser,
  invite: GetInviteByIdResult,
): void {
  if (user.role === UserRole.SUPER_ADMIN) return;

  if (!user.college_id) {
    throw Errors.forbidden("Your account is not associated with a college");
  }

  if (invite.college_id !== user.college_id) {
    throw Errors.forbidden("You do not have access to this invite");
  }
}

/**
 * Check 5 — Role Hierarchy Guard
 *
 * Prevents privilege escalation — a lower role cannot revoke
 * an invite issued for a higher role.
 *
 * college_admin → cannot revoke super_admin invites
 * supervisor    → can only revoke student invites
 */
export function assertRevokeRoleHierarchy(
  user: AuthUser,
  invite: GetInviteByIdResult,
): void {
  if (
    user.role === UserRole.COLLEGE_ADMIN &&
    COLLEGE_ADMIN_BLOCKED_ROLES.includes(invite.role)
  ) {
    throw Errors.forbidden("You do not have permission to revoke this invite");
  }

  if (
    user.role === UserRole.SUPERVISOR &&
    SUPERVISOR_BLOCKED_ROLES.includes(invite.role)
  ) {
    throw Errors.forbidden("Supervisors can only revoke student invites");
  }
}

/**
 * Check 6 — Ownership Check
 *
 * Users with only REVOKE_OWN_INVITE (supervisors) can only revoke
 * invites they personally sent. Users with REVOKE_INVITE (super_admin,
 * college_admin) skip this check.
 */
export function assertRevokeOwnership(
  user: AuthUser,
  invite: GetInviteByIdResult,
  { canRevokeAny, canRevokeOwn }: RevokePermissions,
): void {
  if (canRevokeOwn && !canRevokeAny) {
    if (invite.invited_by !== user.id) {
      throw Errors.forbidden("You can only revoke invites you sent");
    }
  }
}

/**
 * Check 7 — Self-invite Guard
 *
 * Prevents a user from revoking an invite addressed to their own email.
 */
export function assertNotSelfRevoke(
  user: AuthUser,
  invite: GetInviteByIdResult,
): void {
  if (invite.email === user.email) {
    throw Errors.forbidden("You cannot revoke an invite sent to yourself");
  }
}
