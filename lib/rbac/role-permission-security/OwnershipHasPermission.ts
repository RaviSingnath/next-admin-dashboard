import { hasPermission } from "./hasPermission";
import { Permission } from "../permissions";
import { UserContext } from "@/lib/auth/types";

type CheckOptions = {
  userId?: string;
  ownerId?: string;
};

export function canAccess(
  user: UserContext,
  permission: Permission,
  options?: CheckOptions,
) {
  // Basic RBAC check
  if (hasPermission(user, permission)) return true;

  // Ownership fallback
  if (
    permission === Permission.UPDATE_OWN_STUDENT ||
    permission === Permission.READ_OWN_STUDENT
  ) {
    return options?.userId === options?.ownerId;
  }

  return false;
}
