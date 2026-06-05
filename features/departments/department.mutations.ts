import createClient from "@/lib/supabase/server";
import { TAddDepartment } from "./department.schema";

export async function createDepartmentMutation(
  data: TAddDepartment,
  collegeId: string,
  createdBy: string,
) {
  const supabase = await createClient();

  return supabase
    .from("departments")
    .insert({
      college_id: collegeId,
      department_name: data.department_name,
      created_by: createdBy,
    })
    .select()
    .single();
}

export async function softDeleteDepartmentMutation(departmentId: string) {
  const supabase = await createClient();

  return supabase
    .from("departments")
    .update({
      deleted_at: new Date().toISOString(),
    })
    .eq("id", departmentId);
}
