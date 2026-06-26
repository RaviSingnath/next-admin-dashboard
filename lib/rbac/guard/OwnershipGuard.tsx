"use client";

import { ReactNode } from "react";
import { Permission } from "@/lib/rbac/permissions";
import { hasPermission } from "@/lib/rbac/role-permission-security/hasPermission";
import { useAuth } from "@/context/AuthProvider";

type Props = {
  permission: Permission;
  ownerId?: string;
  children: ReactNode;
  fallback?: ReactNode;
};

export function OwnershipGuard({
  permission,
  ownerId,
  children,
  fallback = null,
}: Props) {
  const { user, loading } = useAuth();

  if (loading) return null; // later add a skeleton

  if (!user) return null;

  const hasAccess =
    hasPermission(user, permission) || (ownerId && user?.id === ownerId);

  if (!hasAccess) return <>{fallback}</>;

  return <>{children}</>;
}
