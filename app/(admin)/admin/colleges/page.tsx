import { Metadata } from "next";
import { getColleges } from "@/lib/services/super-admin.service";
import { CollegeList } from "@/components/admin/colleges/college-list";
import PageWrapperBreadcrumb from "@/components/layout/page-wrapper-breadcrumb";
import { EmptyCollegeList } from "@/components/admin/colleges/empty-college-list";

export const metadata: Metadata = {
  title: "Next.js Blank Page | Next.js Dashboard Template",
  description: "This is Next.js Blank Page Dashboard Template",
};

export default async function CollegesPage() {
  const colleges = await getColleges();

  return (
    <PageWrapperBreadcrumb title="Colleges">
      {colleges.length > 0 ? (
        <CollegeList colleges={colleges} />
      ) : (
        <EmptyCollegeList />
      )}
    </PageWrapperBreadcrumb>
  );
}
