import { AuthUser } from "@/lib/auth/types";
import UserRole from "@/lib/rbac/roles";
import createClient from "@/lib/supabase/server";

export const getStudentsQuery = async (profile: AuthUser) => {
  const supabase = await createClient();

  let query = supabase
    .from("profiles")
    .select(
      `
      id,
      full_name,
      email,
      status,
      created_at,
      deleted_at,
      created_by,
      departments!department_id (
        department_name
      )
    `,
    )
    .order("created_at", { ascending: false })
    .eq("role", UserRole.STUDENT);

  if (profile?.college_id) {
    query = query.eq("college_id", profile.college_id);
  }

  if (profile?.department_id) {
    query = query.eq("department_id", profile.department_id);
  }

  return query;
};
