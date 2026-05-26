import { Metadata } from "next";
import PageWrapperBreadcrumb from "@/components/layout/page-wrapper-breadcrumb";
import { getDepartmentsService } from "@/lib/services/depatments.service";
import { EmptyDepartmentsList } from "@/components/admin/college-department/EmptyDepartmentsList";
import { DepartmentsList } from "@/components/admin/college-department/DepartmentsList";

export const metadata: Metadata = {
  title: "Departments page",
  description: "This is departments Page.",
};

export default async function DepartmentsPage() {
  const departments = await getDepartmentsService();
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
