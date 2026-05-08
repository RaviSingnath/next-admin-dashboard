import UserRole from "@/lib/rbac/roles";
import { UserAppMetadata, User } from "@supabase/supabase-js";

export type UserContext = User & {
  id: string;
  email?: string | null;

  role: UserRole;
  collegeId?: string | null;
  departmentId?: string | null;

  isActive?: boolean;

  // raw supabase user (optional but useful)
  raw?: UserAppMetadata;
};
