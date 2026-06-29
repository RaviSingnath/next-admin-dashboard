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
 * Returns roles that current user is allowed to invite.
 *
 * Uses permissions as the source of truth.
 * Do not duplicate role_permissions here.
 */
export function getInvitableRoles(user: AuthUser): InviteTargetRole[] {
  return INVITE_PERMISSION_MAP.filter(([permission]) =>
    hasPermission(user, permission),
  ).map(([, role]) => role);
}

/**
 * Invite feature policy.
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
      /**
       * College admins and supervisors work inside departments.
       *
       * College admin: can choose department
       * Supervisor:    locked to own department
       * Student:       belongs to department
       */
      visible:
        targetRoles.includes(UserRole.SUPERVISOR) ||
        targetRoles.includes(UserRole.STUDENT),

      editable: user.role === UserRole.COLLEGE_ADMIN,
    },
  };
}

/**
 * Optional server-side check.
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

// ─────────────────────────────────────────────────────────────────────────────
// Revoke permissions
// ─────────────────────────────────────────────────────────────────────────────

export type RevokePermissions = {
  /**
   * REVOKE_INVITE — can revoke any invite within scope.
   * Held by: super_admin, college_admin
   */
  canRevokeAny: boolean;

  /**
   * REVOKE_OWN_INVITE — can only revoke invites the user sent.
   * Held by: supervisor
   */
  canRevokeOwn: boolean;
};

/**
 * Resolves which revocation scope the current user holds.
 *
 * Both flags are kept separate so assertRevokeOwnership can
 * distinguish between a supervisor (canRevokeOwn only) and
 * a college_admin who might theoretically hold both.
 */
export function getRevokePermissions(user: AuthUser): RevokePermissions {
  return {
    canRevokeAny: hasPermission(user, Permission.REVOKE_INVITE),
    canRevokeOwn: hasPermission(user, Permission.REVOKE_OWN_INVITE),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Resend permissions
// ─────────────────────────────────────────────────────────────────────────────

export type ResendPermissions = {
  /**
   * RESEND_INVITE — can resend any invite within college scope.
   * Held by: super_admin, college_admin
   */
  canResendAny: boolean;

  /**
   * RESEND_OWN_INVITE — can only resend invites the user sent.
   * Held by: supervisor
   */
  canResendOwn: boolean;
};

/**
 * Resolves which resend scope the current user holds.
 *
 * Mirrors getRevokePermissions() — both flags are kept separate so
 * assertResendOwnership can distinguish a supervisor (canResendOwn only)
 * from a college_admin (canResendAny only).
 */
export function getResendPermissions(user: AuthUser): ResendPermissions {
  return {
    canResendAny: hasPermission(user, Permission.RESEND_INVITE),
    canResendOwn: hasPermission(user, Permission.RESEND_OWN_INVITE),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Delete permissions
// ─────────────────────────────────────────────────────────────────────────────

export type DeletePermissions = {
  /** DELETE_INVITE — any invite within scope. Held by: super_admin, college_admin */
  canDeleteAny: boolean;
  /** DELETE_OWN_INVITE — only invites the user sent. Held by: supervisor */
  canDeleteOwn: boolean;
};

/**
 * Resolves which deletion scope the current user holds.
 *
 * Mirrors getRevokePermissions() and getResendPermissions() — both flags
 * are kept separate so assertDeleteOwnership can distinguish a supervisor
 * (canDeleteOwn only) from a college_admin (canDeleteAny only).
 */
export function getDeletePermissions(user: AuthUser): DeletePermissions {
  return {
    canDeleteAny: hasPermission(user, Permission.DELETE_INVITE),
    canDeleteOwn: hasPermission(user, Permission.DELETE_OWN_INVITE),
  };
}
