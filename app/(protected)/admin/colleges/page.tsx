import { Metadata } from "next";
import { getCollegesService } from "@/features/colleges/college.service";
import CollegeList from "./_components/college-list";
import EmptyCollegeList from "./_components/empty-college-list";
import PageWrapperBreadcrumb from "@/components/layout/page-wrapper-breadcrumb";

export const metadata: Metadata = {
  title: "Next.js Blank Page | Next.js Dashboard Template",
  description: "This is Next.js Blank Page Dashboard Template",
};

export default async function CollegesPage() {
  const colleges = await getCollegesService();

  return (
    <PageWrapperBreadcrumb title="Colleges">
      {colleges.length > 0 ? (
        <CollegeList colleges={colleges} />
      ) : (
        <EmptyCollegeList colleges={colleges} />
      )}
    </PageWrapperBreadcrumb>
  );
}
