import UserRole from "../roles";
import { Permission } from "@/lib/rbac/permissions";
import { ROLE_PERMISSIONS } from "@/lib/rbac/role_permissions";
import { AuthUser } from "@/lib/auth/types";

export function hasPermission(user: AuthUser, permission: Permission): boolean {
  if (!user) return false;

  // Super Admin shortcut (fast path)
  // if (user.role === UserRole.SUPER_ADMIN) return true;

  // If explicit permissions exist (future-proofing)
  const userRole = user?.role as UserRole;
  const permissions = ROLE_PERMISSIONS[userRole] ?? [];
  console.log(userRole, permissions);

  return permissions.includes(permission);
}
