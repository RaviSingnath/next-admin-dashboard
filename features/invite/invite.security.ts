import UserRole from "@/lib/rbac/roles";
import type { AuthUser } from "@/lib/auth/types";

import type { TInvitePayload } from "./invite.schema";
import { RequestContext } from "@/lib/auth/request-context";
import { canInviteRole, type RevokePermissions } from "./invite.rbac";
import { Errors } from "@/lib/errors/error-factory";
import type { GetInviteByIdResult } from "./invite.queries";
import {
  REVOCABLE_STATUSES,
  INVITATION_STATUS,
  COLLEGE_ADMIN_BLOCKED_ROLES,
  SUPERVISOR_BLOCKED_ROLES,
} from "./invite.constants";

// ─────────────────────────────────────────────────────────────────────────────
// Invite creation security
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Check if user can invite inside a college.
 */
export function canInviteCollege(user: AuthUser, collegeId: string): boolean {
  switch (user.role) {
    case UserRole.SUPER_ADMIN:
      return true;

    case UserRole.COLLEGE_ADMIN:
      return user.college_id === collegeId;

    case UserRole.SUPERVISOR:
      return user.college_id === collegeId;

    default:
      return false;
  }
}

/**
 * Check if user can invite inside a department.
 */
export function canInviteDepartment(
  user: AuthUser,
  departmentId?: string | null,
): boolean {
  // Some invites do not require a department
  if (!departmentId) return true;

  switch (user.role) {
    case UserRole.SUPER_ADMIN:
      return true;

    case UserRole.COLLEGE_ADMIN:
      // College admin can select any department within their college
      return true;

    case UserRole.SUPERVISOR:
      // Supervisor is locked to their own department
      return user.department_id === departmentId;

    default:
      return false;
  }
}

/**
 * Check if user can invite into both college and department together.
 */
export function canInviteIntoScope(
  user: AuthUser,
  data: TInvitePayload,
): boolean {
  return (
    canInviteCollege(user, data.college_id) &&
    canInviteDepartment(user, data.department_id)
  );
}

/**
 * Asserts the current user is allowed to send the given invite.
 * Throws Errors.forbidden() on any violation.
 *
 * Fix: previous version had early `return` before the combined scope
 * check, making that check dead code whenever college_id was present.
 * Checks now run sequentially with no early returns.
 */
export function assertCanInvite(ctx: RequestContext, data: TInvitePayload) {
  const { user } = ctx;

  // 1. Permission check — can this role send invites to the target role?
  if (!canInviteRole(user, data.target_role)) {
    throw Errors.forbidden("You cannot invite this role");
  }

  // 2. College scope check
  if (data.college_id && !canInviteCollege(user, data.college_id)) {
    throw Errors.forbidden("You cannot invite into this college");
  }

  // 3. Department scope check
  if (data.department_id && !canInviteDepartment(user, data.department_id)) {
    throw Errors.forbidden("You cannot invite into this department");
  }
}

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
