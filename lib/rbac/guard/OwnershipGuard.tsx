"use client";

import { ReactNode } from "react";
import { Permission } from "@/lib/rbac/permissions";
import { hasPermission } from "@/lib/rbac/role-permission-security/hasPermission";
import useUser from "@/hooks/useUser";

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
  const { user } = useUser();
  if (!user) return;

  const hasAccess =
    hasPermission(user, permission) || (ownerId && user?.id === ownerId);

  if (!hasAccess) return <>{fallback}</>;

  return <>{children}</>;
}
