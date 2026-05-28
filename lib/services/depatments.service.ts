import createClient from "@/lib/supabase/server";
import { getProfile } from "./helper/getProfile";
import { AppError } from "../app-error";
import { TAddDepartment } from "../validations/admin/college-schema";
import { TDepartmentFilters } from "@/types/departments.types";

// getDepartmentByIdService()
// updateDepartmentService()
// filterDepartmentsService()

export async function getDepartmentsService(filters: TDepartmentFilters) {
  const supabase = await createClient();

  const profile = await getProfile();

  if (!profile) {
    throw new Error("user not logged in");
  }

  if (!profile.college_id) {
    throw new Error("Profile is not associated with a college");
  }

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
    .eq("college_id", profile.college_id);

  // Soft delete handling\
  if (!filters?.includeDeleted) {
    query = query.is("deleted_at", null);
  }

  const { data: departmentsData, error } = await query;

  if (error) {
    throw error;
  }

  return departmentsData;
}

export type DepartmentsListResponse = Awaited<
  ReturnType<typeof getDepartmentsService>
>;

export type DepartmentsListItem = DepartmentsListResponse[number];

export async function createDepartmentService(data: TAddDepartment) {
  const supabase = await createClient();

  const profile = await getProfile();

  if (!profile) {
    throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
  }

  if (profile?.role !== "college_admin") {
    throw new AppError(
      "Only college admin can create departments",
      403,
      "FORBIDDEN",
    );
  }

  if (profile.status !== "active") {
    throw new Error("Inactive users cannot create departments");
  }

  if (!profile.college_id) {
    throw new Error("Profile is not associated with a college");
  }

  const { data: existingDepartment } = await supabase
    .from("departments")
    .select("id")
    .eq("department_name", data.department_name)
    .eq("college_id", profile.college_id)
    .is("deleted_at", null)
    .maybeSingle();

  if (existingDepartment) {
    throw new AppError("Department already exists", 409, "DEPARTMENT_EXISTS");
  }

  const { data: department, error } = await supabase
    .from("departments")
    .insert({
      college_id: profile.college_id,
      department_name: data.department_name,
      created_by: profile.id,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return department;
}

export async function deleteDepartmentService(departmentId: string) {
  const supabase = await createClient();

  const profile = await getProfile();

  if (!profile) {
    throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
  }

  if (profile?.role !== "college_admin") {
    throw new AppError(
      "Only college admin can delete departments",
      403,
      "FORBIDDEN",
    );
  }

  if (profile.status !== "active") {
    throw new Error("Inactive users cannot delete departments");
  }

  if (!profile.college_id) {
    throw new Error("Profile is not associated with a college");
  }

  const { data: department } = await supabase
    .from("departments")
    .select(`id, college_id`)
    .eq("id", departmentId)
    .eq("college_id", profile.college_id)
    .maybeSingle();

  if (!department) {
    throw new AppError("Department not found", 409, "NO_FOUND");
  }

  if (department.college_id !== profile.college_id) {
    throw new Error("You cannot delete this department");
  }

  const { error: deleteError } = await supabase
    .from("departments")
    .update({
      deleted_at: new Date().toISOString(),
    })
    .eq("id", departmentId);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  return {
    success: true,
  };
}
