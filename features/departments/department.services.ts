import { TDepartmentFilters } from "./types";
import { getProfile } from "@/lib/services/helper/getProfile";
import {
  getDepartmentsQuery,
  getCollegeDepatmentByName,
  getCollegeDepatmentById,
} from "./department.queries";
import { AppError } from "@/lib/app-error";
import {
  createDepartmentMutation,
  softDeleteDepartmentMutation,
} from "./department.mutations";
import { TAddDepartment } from "./department.schema";

export async function getDepartmentsService(filters?: TDepartmentFilters) {
  const profile = await getProfile();

  if (!profile) {
    throw new Error("user not logged in");
  }

  if (!profile.college_id) {
    throw new Error("Profile is not associated with a college");
  }

  const query = getDepartmentsQuery(profile.college_id, filters);

  const { data: departmentsData, error } = await query;

  if (error) {
    throw error;
  }

  return departmentsData;
}

type DepartmentsListResponse = Awaited<
  ReturnType<typeof getDepartmentsService>
>;
export type DepartmentsListItem = DepartmentsListResponse[number];

export async function createDepartmentService(data: TAddDepartment) {
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
    throw error;
  }

  return department;
}

export async function softDeleteDepartmentService(departmentId: string) {
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

  const { data: department } = await getCollegeDepatmentById(
    departmentId,
    profile.college_id,
  );

  if (!department) {
    throw new AppError("Department not found", 409, "NO_FOUND");
  }

  if (department.college_id !== profile.college_id) {
    throw new Error("You cannot delete this department");
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
