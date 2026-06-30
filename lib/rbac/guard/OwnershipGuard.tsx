"use client";

import { ReactNode } from "react";
import { Permission } from "@/lib/rbac/permissions";
import { hasPermission } from "@/lib/rbac/role-permission-security/hasPermission";
import { useAuth } from "@/context/AuthProvider";

type Props = {
  /** Broad permission — grants access regardless of ownership (e.g. REVOKE_INVITE) */
  anyPermission: Permission;
  /** Scoped permission — only grants access when the user owns the resource (e.g. REVOKE_OWN_INVITE) */
  ownPermission: Permission;
  ownerId?: string;
  children: ReactNode;
  fallback?: ReactNode;
};

export function OwnershipGuard({
  anyPermission,
  ownPermission,
  ownerId,
  children,
  fallback = null,
}: Props) {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return null;

  // Mirrors assertCanX + assertXOwnership: any-permission wins outright;
  // own-permission requires the user to actually hold it AND own the resource.
  const hasAccess =
    hasPermission(user, anyPermission) ||
    (hasPermission(user, ownPermission) && !!ownerId && user.id === ownerId);

  if (!hasAccess) return <>{fallback}</>;

  return <>{children}</>;
}
