import { TDepartmentFilters } from "./types";
import { getProfile } from "@/lib/services/helper/getProfile";
import {
  getDepartmentsQuery,
  getCollegeDepatmentByName,
  getCollegeDepatmentById,
} from "./department.queries";
import AppError from "@/lib/errors/app-error";
import {
  createDepartmentMutation,
  softDeleteDepartmentMutation,
} from "./department.mutations";
import { TAddDepartment } from "./department.schema";
import { mapSupabaseError } from "@/lib/errors/supabase-error";
import { Errors } from "@/lib/errors/error-factory";

export async function getDepartmentsService(filters?: TDepartmentFilters) {
  const profile = await getProfile();

  if (!profile) {
    throw Errors.unauthorized();
  }

  if (!profile.college_id) {
    throw Errors.collegeNotAssigned();
  }

  const query = getDepartmentsQuery(profile.college_id, filters);

  const { data, error } = await query;

  if (error) {
    throw mapSupabaseError(error);
  }

  return data ?? [];
}

type DepartmentsListResponse = Awaited<
  ReturnType<typeof getDepartmentsService>
>;
export type DepartmentsListItem = DepartmentsListResponse[number];

export async function createDepartmentService(data: TAddDepartment) {
  const profile = await getProfile();

  if (!profile) {
    throw Errors.unauthorized();
  }

  if (profile?.role !== "college_admin") {
    throw Errors.forbidden("Only college admins can create departments");
  }

  if (profile.status !== "active") {
    throw Errors.forbidden("Inactive users cannot perform this action");
  }

  if (!profile.college_id) {
    throw Errors.collegeNotAssigned();
  }

  const { data: existingDepartment } = await getCollegeDepatmentByName(
    data.department_name,
    profile.college_id,
  );

  if (existingDepartment) {
    throw new AppError("Department already exists", 409, "DEPARTMENT_EXISTS");
  }

  const { data: department, error } = await createDepartmentMutation(
    data,
    profile.college_id,
    profile.id,
  );

  if (error) {
    throw mapSupabaseError(error);
  }

  return department;
}

export async function softDeleteDepartmentService(departmentId: string) {
  const profile = await getProfile();

  if (!profile) {
    throw Errors.unauthorized();
  }

  if (profile?.role !== "college_admin") {
    throw Errors.forbidden("Only college admins can delete department");
  }

  if (profile.status !== "active") {
    throw Errors.forbidden("Inactive users cannot perform this action");
  }

  if (!profile.college_id) {
    throw Errors.forbidden("Only college admins can perform this action");
  }

  const { data: department } = await getCollegeDepatmentById(
    departmentId,
    profile.college_id,
  );

  if (!department) {
    throw Errors.notFound("Department not found");
  }

  if (department.college_id !== profile.college_id) {
    throw Errors.forbidden("Yous cannot delete this department");
  }

  const { error: deleteError } =
    await softDeleteDepartmentMutation(departmentId);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  return {
    success: true,
  };
}
