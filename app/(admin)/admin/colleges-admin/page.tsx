import { Metadata } from "next";
import { getCollegeAdmins } from "@/lib/services/super-admin.service";
import PageWrapperBreadcrumb from "@/components/layout/page-wrapper-breadcrumb";
import CollegeAdminsList from "@/components/admin/college-admin/college-admin-list";
import EmptyCollegeAdminList from "@/components/admin/college-admin/empty-college-admin-list";
import { getCollegesService } from "@/features/colleges/college.service";

export const metadata: Metadata = {
  title: "Next.js Blank Page | Next.js Dashboard Template",
  description: "This is Next.js Blank Page Dashboard Template",
};

export default async function CollegesAdminPage() {
  const collegeAdmins = await getCollegeAdmins();
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
