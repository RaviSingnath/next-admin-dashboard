import UserRole from "@/lib/rbac/roles";
import type { AuthUser } from "@/lib/auth/types";
import { type ResendPermissions } from "../invite.rbac";
import { Errors } from "@/lib/errors/error-factory";
import type { GetInviteForResendResult } from "../invite.queries";
import {
  INVITATION_STATUS,
  COLLEGE_ADMIN_BLOCKED_ROLES,
  SUPERVISOR_BLOCKED_ROLES,
} from "../invite.constants";

// ─────────────────────────────────────────────────────────────────────────────
// Resend invite security
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Check 1 — Permission Gate
 *
 * Fails before any DB call if the user holds neither
 * RESEND_INVITE nor RESEND_OWN_INVITE.
 */
export function assertCanResend(
  user: AuthUser,
  { canResendAny, canResendOwn }: ResendPermissions,
): void {
  if (!canResendAny && !canResendOwn) {
    throw Errors.forbidden("You do not have permission to resend invites");
  }
}

/**
 * Check 3 — Status + Expiry Guard (combined)
 *
 * Resend is only valid when:
 *   (a) The invite is still `pending` — not yet accepted, revoked,
 *       onboarding, or cancelled.
 *   (b) The invite token has expired — expires_at is in the past.
 *
 * A still-active pending invite does not need resending. Resend is
 * specifically the mechanism to refresh an expired-but-unaccepted invite.
 *
 * Status is checked first to give the most informative error message.
 */
export function assertInviteIsResendable(
  invite: GetInviteForResendResult,
  date: string,
): void {
  // (a) Status guard — pending and expired are the only resendable statuses.
  //     expired = cron has already confirmed the token is dead.
  //     pending = token may still be alive; expiry is checked below.
  if (
    invite.status !== INVITATION_STATUS.PENDING &&
    invite.status !== INVITATION_STATUS.EXPIRED
  ) {
    const message =
      invite.status === INVITATION_STATUS.REVOKED
        ? "This invite has been revoked and cannot be resent"
        : invite.status === INVITATION_STATUS.ONBOARDING
          ? "This invite has already been accepted and is in onboarding"
          : invite.status === INVITATION_STATUS.ACCEPTED
            ? "This invite has already been accepted"
            : "This invite cannot be resent in its current state";

    throw Errors.conflict(message);
  }

  // (b) Expiry guard — only relevant for pending invites.
  //     An invite with status 'expired' was set by the cron job precisely
  //     because expires_at already passed; rechecking it here is redundant.
  if (invite.status === INVITATION_STATUS.PENDING && invite.expires_at > date) {
    throw Errors.conflict(
      "This invite has not yet expired and does not need to be resent",
    );
  }
}

/**
 * Check 4 — College Scope
 *
 * super_admin operates platform-wide — skipped.
 * college_admin and supervisor must share the invite's college.
 *
 * NOTE: Same intentional avoidance of Errors.collegeNotAssigned() as in
 * assertRevokeCollegeScope — see that function's comment for context.
 */
export function assertResendCollegeScope(
  user: AuthUser,
  invite: GetInviteForResendResult,
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
 * Supervisors can only resend invites belonging to their own department.
 *
 * This is defence-in-depth: the ownership check (assertResendOwnership)
 * already ensures a supervisor can only resend invites they personally
 * sent, and supervisors can only invite within their own department.
 * This check makes the department constraint explicit rather than
 * relying on that transitive guarantee.
 */
export function assertResendDepartmentScope(
  user: AuthUser,
  invite: GetInviteForResendResult,
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
 * Prevents privilege escalation — a lower role cannot resend
 * an invite issued for a higher role.
 *
 * Mirrors assertRevokeRoleHierarchy exactly:
 * college_admin → cannot resend super_admin invites
 * supervisor    → can only resend student invites
 */
export function assertResendRoleHierarchy(
  user: AuthUser,
  invite: GetInviteForResendResult,
): void {
  if (
    user.role === UserRole.COLLEGE_ADMIN &&
    COLLEGE_ADMIN_BLOCKED_ROLES.includes(invite.role)
  ) {
    throw Errors.forbidden("You do not have permission to resend this invite");
  }

  if (
    user.role === UserRole.SUPERVISOR &&
    SUPERVISOR_BLOCKED_ROLES.includes(invite.role)
  ) {
    throw Errors.forbidden("Supervisors can only resend student invites");
  }
}

/**
 * Check 7 — Ownership Check
 *
 * Users with only RESEND_OWN_INVITE (supervisors) can only resend invites
 * they personally sent. Users with RESEND_INVITE (super_admin, college_admin)
 * skip this check.
 *
 * Mirrors assertRevokeOwnership exactly.
 */
export function assertResendOwnership(
  user: AuthUser,
  invite: GetInviteForResendResult,
  { canResendAny, canResendOwn }: ResendPermissions,
): void {
  if (canResendOwn && !canResendAny) {
    if (invite.invited_by !== user.id) {
      throw Errors.forbidden("You can only resend invites you sent");
    }
  }
}

/**
 * Check 8 — Self-invite Guard
 *
 * Prevents a user from resending an invite addressed to their own email.
 * Mirrors assertNotSelfRevoke.
 */
export function assertNotSelfResend(
  user: AuthUser,
  invite: GetInviteForResendResult,
): void {
  if (invite.email === user.email) {
    throw Errors.forbidden("You cannot resend an invite sent to yourself");
  }
}
