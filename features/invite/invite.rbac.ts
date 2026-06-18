import UserRole from "@/lib/rbac/roles";
import { Permission } from "@/lib/rbac/permissions";
import { hasPermission } from "@/lib/rbac/role-permission-security/hasPermission";
import { AuthUser } from "@/lib/auth/types";
import { InviteTargetRole } from "./invite.schema";

export type InviteUIRules = {
  canInvite: boolean;

  /**
   * Roles the current user can invite
   */
  targetRoles: InviteTargetRole[];

  /**
   * Show role dropdown only when user has multiple choices
   */
  showRoleSelector: boolean;

  college: {
    visible: boolean;
    editable: boolean;
  };

  department: {
    visible: boolean;
    editable: boolean;
  };
};

export const INVITE_PERMISSION_MAP: [Permission, InviteTargetRole][] = [
  [Permission.INVITE_COLLEGE_ADMIN, UserRole.COLLEGE_ADMIN],
  [Permission.INVITE_SUPERVISOR, UserRole.SUPERVISOR],
  [Permission.INVITE_STUDENT, UserRole.STUDENT],
];

/**
 * Returns roles that current user is allowed to invite
 *
 * This uses permissions as the source of truth.
 * Do not duplicate role_permissions here.
 */
export function getInvitableRoles(user: AuthUser): InviteTargetRole[] {
  return INVITE_PERMISSION_MAP.filter(([permission]) =>
    hasPermission(user, permission),
  ).map(([, role]) => role);
}

/**
 * Invite feature policy
 *
 * Controls form behaviour.
 */
export function getInviteUIRules(user: AuthUser): InviteUIRules {
  const targetRoles = getInvitableRoles(user);

  const canInvite = targetRoles.length > 0;

  return {
    canInvite,

    targetRoles,

    showRoleSelector: targetRoles.length > 1,

    college: {
      /**
       * Super admin can select college.
       *
       * College admin and supervisor
       * should be locked to their college.
       */
      visible: true,

      editable: user.role === UserRole.SUPER_ADMIN,
    },

    department: {
      // Hidden when inviting college_admin (not dept-scoped).
      // super_admin only invites college_admin → always false for super_admin.
      /**
       * College admins and supervisors
       * work inside departments.
       *
       * College admin:
       *   can choose department
       *
       * Supervisor:
       *   locked to own department
       *
       * Student:
       *   belongs to department
       */
      visible:
        targetRoles.includes(UserRole.SUPERVISOR) ||
        targetRoles.includes(UserRole.STUDENT),

      editable: user.role === UserRole.COLLEGE_ADMIN,
    },
  };
}

/**
 * Optional server-side check
 *
 * Use this in invite action.
 */
export function canInviteRole(
  user: AuthUser,
  targetRole: InviteTargetRole,
): boolean {
  if (!user) return false;
  return getInvitableRoles(user).includes(targetRole);
}
