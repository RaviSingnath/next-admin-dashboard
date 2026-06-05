export type TDepartmentFilters = {
  search?: string | null;
  collegeId?: string | null;
  status?: string | null;

  page?: number;
  limit?: number;

  sortBy?: string;
  order?: "asc" | "desc";

  includeDeleted?: string | null;
};
