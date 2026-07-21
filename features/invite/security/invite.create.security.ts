import UserRole from "@/lib/rbac/roles";
import type { AuthUser } from "@/lib/auth/types";
import { Errors } from "@/lib/errors/error-factory";
import { RequestContext } from "@/lib/auth/request-context";
import { canInviteRole } from "../invite.rbac";
import type { TInvitePayload } from "../invite.schema";

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
  const departmentId = "department_id" in data ? data.department_id : undefined;

  return (
    canInviteCollege(user, data.college_id) &&
    canInviteDepartment(user, departmentId)
  );
}

/**
 * Asserts the current user is allowed to send the given invite.
 * Throws Errors.forbidden() on any violation.
 */
export function assertCanInvite(ctx: RequestContext, data: TInvitePayload) {
  const { user } = ctx;

  const departmentId = "department_id" in data ? data.department_id : undefined;

  // 1. Permission check — can this role send invites to the target role?
  if (!canInviteRole(user, data.target_role)) {
    throw Errors.forbidden("You cannot invite this role");
  }

  // 2. College scope check
  if (data.college_id && !canInviteCollege(user, data.college_id)) {
    throw Errors.forbidden("You cannot invite into this college");
  }

  // 3. Department scope check
  if (departmentId && !canInviteDepartment(user, departmentId)) {
    throw Errors.forbidden("You cannot invite into this department");
  }
}
