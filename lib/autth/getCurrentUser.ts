import { createClient } from "@/lib/supabase/client";
import { AuthUser } from "@/types/auth";

const supabase = createClient();

export async function getCurrentUser(): Promise<AuthUser | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const authUser = session?.user;

  if (!authUser) {
    return null;
  }
  console.time("profile query");
  const { data: profile, error } = await supabase
    .from("profiles")
    .select(
      `
      id,
      full_name,
      role,
      college_id,
      department_id,
      colleges (
        college_name,
        status
      ),
      departments!department_id (
        department_name
      )
    `,
    )
    .eq("id", authUser.id)
    .single();
  console.timeEnd("profile query");

  if (error || !profile) {
    return null;
  }

  const college = Array.isArray(profile.colleges)
    ? profile.colleges[0]
    : profile.colleges;

  const department = Array.isArray(profile.departments)
    ? profile.departments[0]
    : profile.departments;

  return {
    id: authUser.id,
    email: authUser.email ?? "",

    full_name: profile.full_name,
    role: profile.role,

    college_id: profile.college_id,
    college_name: college?.college_name ?? null,
    college_status: college?.status ?? null,

    department_id: profile.department_id,
    department_name: department?.department_name ?? null,
  };
}
