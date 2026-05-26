import createClient from "@/lib/supabase/server";
import { getProfile } from "./helper/getProfile";

export async function getDepartments() {
  const supabase = await createClient();

  const profile = await getProfile();

  if (!profile) {
    throw new Error("user not logged in");
  }

  if (!profile.college_id) {
    throw new Error("Profile is not associated with a college");
  }

  const { data: departmentsData, error } = await supabase
    .from("departments")
    .select(
      `
    id,
    college_id,
    department_name,
    created_by,
    created_at
  `,
    )
    .order("created_at", { ascending: false })
    .eq("college_id", profile.college_id);

  if (error) {
    throw error;
  }

  return departmentsData;
}

export type DepartmentsListResponse = Awaited<
  ReturnType<typeof getDepartments>
>;

export type DepartmentsListItem = DepartmentsListResponse[number];
