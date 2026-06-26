"use client";

import { ReactNode } from "react";
import { Permission } from "@/lib/rbac/permissions";
import { hasPermission } from "@/lib/rbac/role-permission-security/hasPermission";
import { useAuth } from "@/context/AuthProvider";

type Props = {
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
};

export function ActionGuard({ permission, children, fallback = null }: Props) {
  const { user, loading } = useAuth();

  if (loading) return null; // later add a skeleton

  if (!user) return null;

  if (!hasPermission(user, permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
