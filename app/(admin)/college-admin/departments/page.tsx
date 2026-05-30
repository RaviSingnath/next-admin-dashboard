import { Metadata } from "next";
import PageWrapperBreadcrumb from "@/components/layout/page-wrapper-breadcrumb";
import { getDepartmentsService } from "@/lib/services/depatments.service";
import { EmptyDepartmentsList } from "@/components/admin/college-department/EmptyDepartmentsList";
import { DepartmentsList } from "@/components/admin/college-department/DepartmentsList";
import { TDepartmentFilters } from "@/types/departments.types";

export const metadata: Metadata = {
  title: "Departments page",
  description: "This is departments Page.",
};

type DepartmentsPageProps = {
  searchParams: Promise<TDepartmentFilters>;
};

export default async function DepartmentsPage({
  searchParams,
}: DepartmentsPageProps) {
  const params = await searchParams;

  const departments = await getDepartmentsService({
    includeDeleted: params.includeDeleted,
  });

  return (
    <PageWrapperBreadcrumb title="Departments">
      {departments.length > 0 ? (
        <DepartmentsList departments={departments} />
      ) : (
        <EmptyDepartmentsList />
      )}
    </PageWrapperBreadcrumb>
  );
}
