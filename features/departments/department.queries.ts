"use server";

import createClient from "@/lib/supabase/server";
import { TDepartmentFilters } from "./types";

export async function getDepartmentsQuery(
  collegeID: string,
  filters?: TDepartmentFilters,
) {
  const supabase = await createClient();

  let query = supabase
    .from("departments")
    .select(
      `
    id,
    college_id,
    department_name,
    created_by,
    created_at,
    deleted_at,

    creator:profiles!created_by (
      id,
      full_name
    )
  `,
    )
    .order("created_at", { ascending: false })
    .eq("college_id", collegeID);

  // Soft delete handling\
  if (!filters?.includeDeleted) {
    query = query.is("deleted_at", null);
  }

  return query;
}

export async function getCollegeDepatmentByName(
  departmentName: string,
  collegeID: string,
) {
  const supabase = await createClient();

  return supabase
    .from("departments")
    .select(`id, college_id`)
    .eq("department_name", departmentName)
    .eq("college_id", collegeID)
    .is("deleted_at", null)
    .maybeSingle();
}

export async function getCollegeDepatmentById(
  departmentID: string,
  collegeID: string,
) {
  const supabase = await createClient();

  return supabase
    .from("departments")
    .select(`id, college_id`)
    .eq("id", departmentID)
    .eq("college_id", collegeID)
    .is("deleted_at", null)
    .maybeSingle();
}
