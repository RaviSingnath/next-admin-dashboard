import { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { EmptyCollegeList } from "@/components/admin/empty-college-list";

export const metadata: Metadata = {
  title: "Next.js Blank Page | Next.js Dashboard Template",
  description: "This is Next.js Blank Page Dashboard Template",
};

export default function CollegesPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Colleges" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto w-full max-w-[630px] text-center">
          <EmptyCollegeList />
        </div>
      </div>
    </div>
  );
}
