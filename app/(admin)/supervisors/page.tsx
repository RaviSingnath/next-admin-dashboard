import { Metadata } from "next";
import PageWrapperBreadcrumb from "@/components/layout/page-wrapper-breadcrumb";
import { getSupervisorsService } from "@/lib/services/supervisors.services";
import EmptySupervisorList from "@/components/admin/supervisors/empty-supervisors-list";
import SupervisorsList from "@/components/admin/supervisors/supervisor-list";

export const metadata: Metadata = {
  title: "Supervisors page",
  description: "This is a supervisors Page.",
};

export default async function supervisorsPage() {
  const supervisors = await getSupervisorsService();

  return (
    <PageWrapperBreadcrumb title="Supervisors">
      {supervisors.length > 0 ? (
        <SupervisorsList supervisors={supervisors} />
      ) : (
        <EmptySupervisorList />
      )}
    </PageWrapperBreadcrumb>
  );
}
