import { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { EmptyCollegeAdminList } from "@/components/admin/college-admin/empty-college-admin-list";

export const metadata: Metadata = {
  title: "Next.js Blank Page | Next.js Dashboard Template",
  description: "This is Next.js Blank Page Dashboard Template",
};

export default async function CollegesAdminPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Colleges Admin" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto w-full max-w-[630px] text-center">
          <EmptyCollegeAdminList />
        </div>
      </div>
    </div>
  );
}
