import UserRole from "@/lib/rbac/roles";
import { Database } from "@/supabase/database.types";

export type Invitation = Database["public"]["Tables"]["invitations"]["Row"];

// DB enum is the single source of truth for the type
export type InvitationStatus = Database["public"]["Enums"]["invitation_status"];

export type InvitationInsert =
  Database["public"]["Tables"]["invitations"]["Insert"];

type BaseInvite = {
  email: string;
  full_name: string;
  token: string;
  role: string;
};

export type CollegeAdminInvite = BaseInvite & {
  role: UserRole.COLLEGE_ADMIN;
  college_id: string;
};

export type SupervisorInvite = BaseInvite & {
  role: UserRole.SUPERVISOR;
  college_id: string;
  department_id?: string;
};

export type StudentInvite = BaseInvite & {
  role: UserRole.STUDENT;
  college_id: string;
  department_id?: string;
};

export type InviteData = CollegeAdminInvite | SupervisorInvite | StudentInvite;
