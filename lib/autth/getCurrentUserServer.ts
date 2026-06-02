// lib/auth/getCurrentUserServer.ts

import createClient from "@/lib/supabase/server";

export async function getCurrentUserServer() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

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
    .eq("id", user.id)
    .single();

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
    id: user.id,
    email: user.email ?? "",

    full_name: profile.full_name,
    role: profile.role,

    college_id: profile.college_id,
    college_name: college?.college_name ?? null,
    college_status: college?.status ?? null,

    department_id: profile.department_id,
    department_name: department?.department_name ?? null,
  };
}
