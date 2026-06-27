import { hasPermission } from "./hasPermission";
import { Permission } from "../permissions";
import { AuthUser } from "@/lib/auth/types";

type CheckOptions = {
  userId?: string;
  ownerId?: string;
};

/**
 * Permissions that require ownership verification in addition to RBAC.
 *
 * When a user holds one of these permissions, canAccess() will also check
 * that options.userId === options.ownerId before granting access.
 */
const OWNERSHIP_PERMISSIONS = new Set([
  Permission.READ_OWN_STUDENT,
  Permission.UPDATE_OWN_STUDENT,
  Permission.RESEND_OWN_INVITE,
  Permission.REVOKE_OWN_INVITE,
  Permission.DELETE_OWN_INVITE,
]);

export function canAccess(
  user: AuthUser,
  permission: Permission,
  options?: CheckOptions,
) {
  // Basic RBAC check
  if (hasPermission(user, permission)) return true;

  // Ownership fallback
  if (OWNERSHIP_PERMISSIONS.has(permission)) {
    if (!options?.userId || !options?.ownerId) return false;
    return options.userId === options.ownerId;
  }

  return false;
}
