import { Metadata } from "next";
import PageWrapperBreadcrumb from "@/components/layout/page-wrapper-breadcrumb";
import { getSupervisorsService } from "@/features/supervisors/supervisors.services";
import EmptySupervisorList from "@/app/(admin)/supervisors/_components/empty-supervisors-list";
import SupervisorsList from "@/app/(admin)/supervisors/_components/supervisor-list";

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
