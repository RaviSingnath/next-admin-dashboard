import { UserContext } from "./types";
import UserRole from "@/lib/rbac/roles";
import { User } from "@supabase/supabase-js";

export function parseUser(user: User | null): UserContext | null {
  if (!user) return null;

  const claims = user.app_metadata || {};

  const userContext = {
    ...user,
    ...{
      id: user.id,
      email: user.email,

      role: claims.role as UserRole,
      collegeId: claims.college_id ?? null,
      departmentId: claims.department_id ?? null,
      isActive: claims.is_active ?? true,
    },
  };

  return userContext;
}
