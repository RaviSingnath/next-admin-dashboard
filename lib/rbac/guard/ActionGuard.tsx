"use client";

import { ReactNode } from "react";
import { Permission } from "@/lib/rbac/permissions";
import { hasPermission } from "@/lib/rbac/role-permission-security/hasPermission";
import useUser from "@/hooks/useUser";

type Props = {
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
};

export function ActionGuard({ permission, children, fallback = null }: Props) {
  const { user } = useUser();
  if (!user) return;

  if (!hasPermission(user, permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
