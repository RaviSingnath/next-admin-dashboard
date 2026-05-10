import { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { EmptyCollegeList } from "@/components/admin/colleges/empty-college-list";
import { getColleges } from "@/lib/services/super-admin.service";
import { CollegeList } from "@/components/admin/colleges/college-list";

export const metadata: Metadata = {
  title: "Next.js Blank Page | Next.js Dashboard Template",
  description: "This is Next.js Blank Page Dashboard Template",
};

export default async function CollegesPage() {
  const colleges = await getColleges();

  return (
    <div>
      <PageBreadcrumb pageTitle="Colleges" />
      <div className="space-y-6">
        {colleges.length > 0 ? (
          <CollegeList colleges={colleges} />
        ) : (
          <EmptyCollegeList />
        )}
      </div>
    </div>
  );
}
