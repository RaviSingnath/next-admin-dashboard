"use client";

import { ReactNode } from "react";
import { Permission } from "@/lib/rbac/permissions";
import { hasPermission } from "@/lib/rbac/role-permission-security/hasPermission";
import { useAuth } from "@/context/AuthProvider";
import UserRole from "@/lib/rbac/roles";
import { VIEWABLE_TARGET_ROLES } from "@/features/invite/invite.constants";

type Props = {
  /** Permission required at minimum to view this class of user */
  anyPermission: Permission;
  ownPermission: Permission;
  targetCollegeId?: string | null;
  targetDepartmentId?: string | null;
  targetRole: UserRole;
  children: ReactNode;
  fallback?: ReactNode;
};

/**
 * Scope-based guard for viewing users across the college/department hierarchy.
 *
 * Unlike OwnershipGuard (identity match: user.id === ownerId), this checks
 * containment: does the target user fall within the viewer's college/department?
 *
 *   super_admin    — no scope restriction, sees everyone
 *   college_admin  — scoped to their own college_id
 *   supervisor     — scoped to their own department_id (implies college_id too)
 *   student        — no view access (handled by hasPermission failing first)
 */
export function ScopeGuard({
  anyPermission,
  ownPermission,
  targetCollegeId,
  targetDepartmentId,
  targetRole,
  children,
  fallback = null,
}: Props) {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return null;

  // 1. Role hierarchy — can this viewer role even view this target role?
  const viewableRoles = VIEWABLE_TARGET_ROLES[user.role as UserRole] ?? [];
  if (!viewableRoles.includes(targetRole)) {
    return <>{fallback}</>;
  }

  // 2. Scope containment — is this specific target within the viewer's scope?
  let inScope = false;

  if (hasPermission(user, anyPermission)) {
    inScope =
      user.role === UserRole.SUPER_ADMIN ||
      (!!user.college_id && user.college_id === targetCollegeId);
  } else if (hasPermission(user, ownPermission)) {
    inScope = !!user.department_id && user.department_id === targetDepartmentId;
  }

  if (!inScope) return <>{fallback}</>;
  return <>{children}</>;
}
