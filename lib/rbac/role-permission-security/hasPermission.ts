import UserRole from "../roles";
import { Permission } from "@/lib/rbac/permissions";
import { ROLE_PERMISSIONS } from "@/lib/rbac/role_permissions";
import { UserContext } from "@/lib/autth/types";

// type UserContext = {
//   role: UserRole;
//   user: User;
//   permissions?: Permission[];
// };

export function hasPermission(
  user: UserContext,
  permission: Permission,
): boolean {
  if (!user) return false;

  // Super Admin shortcut (fast path)
  if (user.role === UserRole.SUPER_ADMIN) return true;

  // If explicit permissions exist (future-proofing)
  const permissions = user?.role ?? ROLE_PERMISSIONS[user?.role] ?? [];

  return permissions.includes(permission);
}
