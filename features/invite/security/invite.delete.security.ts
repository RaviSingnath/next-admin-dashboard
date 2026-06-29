import UserRole from "@/lib/rbac/roles";
import type { AuthUser } from "@/lib/auth/types";
import { type DeletePermissions } from "../invite.rbac";
import { Errors } from "@/lib/errors/error-factory";
import type { GetInviteForDeleteResult } from "../invite.queries";
import {
  INVITATION_STATUS,
  DELETABLE_STATUSES,
  COLLEGE_ADMIN_BLOCKED_ROLES,
  SUPERVISOR_BLOCKED_ROLES,
} from "../invite.constants";

// ─────────────────────────────────────────────────────────────────────────────
// Delete invite security
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Check 1 — Permission Gate
 *
 * Fails before any DB call if the user holds neither
 * DELETE_INVITE nor DELETE_OWN_INVITE.
 */
export function assertCanDelete(
  user: AuthUser,
  { canDeleteAny, canDeleteOwn }: DeletePermissions,
): void {
  if (!canDeleteAny && !canDeleteOwn) {
    throw Errors.forbidden("You do not have permission to delete invites");
  }
}

/**
 * Check 3 — Already-deleted Guard + Status Guard (combined)
 *
 * Two conditions must hold for deletion to proceed:
 *   (a) deleted_at must be null — the invite has not already been
 *       soft-deleted. Checked first to give the most specific message.
 *   (b) status must be one of DELETABLE_STATUSES — onboarding and
 *       accepted invites are protected because they represent an active
 *       or completed user journey.
 *
 * Status is intentionally left unchanged by the delete operation. This
 * preserves the lifecycle history (e.g. pending → revoked → deleted)
 * so audit logs remain meaningful.
 */
export function assertInviteIsDeletable(
  invite: GetInviteForDeleteResult,
): void {
  // (a) Already-deleted guard
  if (invite.deleted_at !== null) {
    throw Errors.conflict("This invite has already been deleted");
  }

  // (b) Status guard
  if (
    !DELETABLE_STATUSES.includes(
      invite.status as (typeof DELETABLE_STATUSES)[number],
    )
  ) {
    const message =
      invite.status === INVITATION_STATUS.ONBOARDING
        ? "This invite cannot be deleted while the user is completing onboarding"
        : invite.status === INVITATION_STATUS.ACCEPTED
          ? "This invite cannot be deleted after it has been accepted"
          : "This invite cannot be deleted in its current state";

    throw Errors.conflict(message);
  }
}

/**
 * Check 4 — College Scope
 *
 * super_admin operates platform-wide — skipped.
 * college_admin and supervisor must share the invite's college.
 */
export function assertDeleteCollegeScope(
  user: AuthUser,
  invite: GetInviteForDeleteResult,
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
 * Check 5 — Department Scope
 *
 * Only enforced for supervisors, who are locked to a single department.
 *
 * super_admin and college_admin are not department-scoped — skipped.
 *
 * This is defence-in-depth: the ownership check (assertDeleteOwnership)
 * already ensures a supervisor can only delete invites they personally
 * sent, and supervisors can only invite within their own department.
 * Making the department constraint explicit avoids relying on that
 * transitive guarantee.
 */
export function assertDeleteDepartmentScope(
  user: AuthUser,
  invite: GetInviteForDeleteResult,
): void {
  if (user.role !== UserRole.SUPERVISOR) return;

  if (!user.department_id) {
    throw Errors.forbidden("Your account is not associated with a department");
  }

  if (invite.department_id !== user.department_id) {
    throw Errors.forbidden("You do not have access to this invite");
  }
}

/**
 * Check 6 — Role Hierarchy Guard
 *
 * Prevents privilege escalation — a lower role cannot delete an invite
 * issued for an equal or higher role.
 *
 * college_admin → cannot delete super_admin invites
 * supervisor    → can only delete student invites
 */
export function assertDeleteRoleHierarchy(
  user: AuthUser,
  invite: GetInviteForDeleteResult,
): void {
  if (
    user.role === UserRole.COLLEGE_ADMIN &&
    COLLEGE_ADMIN_BLOCKED_ROLES.includes(invite.role)
  ) {
    throw Errors.forbidden("You do not have permission to delete this invite");
  }

  if (
    user.role === UserRole.SUPERVISOR &&
    SUPERVISOR_BLOCKED_ROLES.includes(invite.role)
  ) {
    throw Errors.forbidden("Supervisors can only delete student invites");
  }
}

/**
 * Check 7 — Ownership Check
 *
 * Users with only DELETE_OWN_INVITE (supervisors) can only delete invites
 * they personally sent. Users with DELETE_INVITE (super_admin, college_admin)
 * skip this check.
 *
 * Mirrors assertRevokeOwnership and assertResendOwnership exactly.
 */
export function assertDeleteOwnership(
  user: AuthUser,
  invite: GetInviteForDeleteResult,
  { canDeleteAny, canDeleteOwn }: DeletePermissions,
): void {
  if (canDeleteOwn && !canDeleteAny) {
    if (invite.invited_by !== user.id) {
      throw Errors.forbidden("You can only delete invites you sent");
    }
  }
}

/**
 * Check 8 — Self-invite Guard
 *
 * Prevents a user from deleting an invite addressed to their own email.
 * Mirrors assertNotSelfRevoke and assertNotSelfResend.
 */
export function assertNotSelfDelete(
  user: AuthUser,
  invite: GetInviteForDeleteResult,
): void {
  if (invite.email === user.email) {
    throw Errors.forbidden("You cannot delete an invite sent to yourself");
  }
}
