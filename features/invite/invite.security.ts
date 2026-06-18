import UserRole from "@/lib/rbac/roles";
import type { AuthUser } from "@/lib/auth/types";

import type { TInvitePayload } from "./invite.schema";
import { RequestContext } from "@/lib/auth/request-context";
import { canInviteRole } from "./invite.rbac";
import { Errors } from "@/lib/errors/error-factory";

/**
 * Check if user can invite inside a college
 */
export function canInviteCollege(user: AuthUser, collegeId: string): boolean {
  switch (user.role) {
    case UserRole.SUPER_ADMIN:
      // Super admin can invite into any college
      return true;

    case UserRole.COLLEGE_ADMIN:
      // College admin only works inside own college
      return user.college_id === collegeId;

    case UserRole.SUPERVISOR:
      // Supervisor only works inside own college
      return user.college_id === collegeId;

    default:
      return false;
  }
}

/**
 * Check if user can invite inside a department
 */
export function canInviteDepartment(
  user: AuthUser,
  departmentId?: string | null,
): boolean {
  // Some invites do not require department
  if (!departmentId) {
    return true;
  }

  switch (user.role) {
    case UserRole.SUPER_ADMIN:
      // Super admin can manage all departments
      return true;

    case UserRole.COLLEGE_ADMIN:
      // College admin can select departments
      return true;

    case UserRole.SUPERVISOR:
      // Supervisor is locked to own department
      return user.department_id === departmentId;

    default:
      return false;
  }
}

/**
 * Validate complete invite scope
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

export function assertCanInvite(ctx: RequestContext, data: TInvitePayload) {
  const { user } = ctx;

  // 1. Role permission check
  if (!canInviteRole(user, data.target_role)) {
    throw Errors.forbidden("You cannot invite this role");
  }

  if (data.college_id) {
    return canInviteCollege(user, data.college_id);
  }

  if (data.department_id) {
    return canInviteDepartment(user, data.department_id);
  }

  // 2. Scope check
  if (data.college_id && data.department_id) {
    if (!canInviteIntoScope(user, data)) {
      throw Errors.forbidden("You cannot invite into this scope");
    }
  }

  // 3. Other invite-specific rules
  // Example:
  // - cannot invite yourself
  // - email domain restrictions
  // - invitation limits
  // - duplicate invitations

  return true;
}
