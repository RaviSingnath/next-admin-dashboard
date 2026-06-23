import { Metadata } from "next";
import PageWrapperBreadcrumb from "@/components/layout/page-wrapper-breadcrumb";
import CollegeAdminsList from "./_components/college-admin-list";
import EmptyCollegeAdminList from "./_components/empty-college-admin-list";
import { getCollegesService } from "@/features/colleges/college.service";
import { getCollegeAdminsService } from "@/features/college-admins/college-admin.services";

export const metadata: Metadata = {
  title: "Next.js Blank Page | Next.js Dashboard Template",
  description: "This is Next.js Blank Page Dashboard Template",
};

export default async function CollegesAdminPage() {
  const collegeAdmins = await getCollegeAdminsService();
  const colleges = await getCollegesService();

  return (
    <PageWrapperBreadcrumb title="College Admins">
      {collegeAdmins.length > 0 ? (
        <CollegeAdminsList colleges={colleges} collegeAdmins={collegeAdmins} />
      ) : (
        <EmptyCollegeAdminList colleges={colleges} />
      )}
    </PageWrapperBreadcrumb>
  );
}
