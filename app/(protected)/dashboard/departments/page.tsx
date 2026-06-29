import { Metadata } from "next";
import PageWrapperBreadcrumb from "@/components/layout/page-wrapper-breadcrumb";
import { getDepartmentsService } from "@/features/departments/department.services";
import EmptyDepartmentsList from "./_components/empty-departments-list";
import DepartmentsList from "./_components/departments-list";
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
