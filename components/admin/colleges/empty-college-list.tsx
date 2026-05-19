import { Building2 } from "lucide-react";
import Link from "next/link";
import { AddCollegeButton } from "../add-college-button";
import { Title } from "@/components/ui/text/title";
import { Description } from "@/components/ui/text/description";
import { getColleges } from "@/lib/services/super-admin.service";

type EmptyCollegeListProps = {
  className?: string;
};

export async function EmptyCollegeList({ className }: EmptyCollegeListProps) {
  const colleges = await getColleges();
  return colleges.length > 0 ? (
    <div className="min-h-screen  bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
      <div className="mx-auto w-full max-w-[630px] text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gray-100 border border-gray-200 mb-6">
          <Building2 className="w-8 h-8 text-gray-400" />
        </div>

        <Title>No colleges added yet</Title>
        <Description>
          No colleges have been configured in the system. Add your first college
          to start managing campuses, departments, and student access.
        </Description>

        <AddCollegeButton />
      </div>
    </div>
  ) : (
    <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
      <div className="mx-auto w-full max-w-[630px] text-center">
        <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-gray-100 border border-gray-200 mb-6">
          <Building2 className="w-8 h-8 text-gray-400" />
        </div>

        <Title>Add a college first</Title>
        <Description>
          You need to add at least one college before you can assign a college
          admin. Once a college is added, you will be able to manage its admins
          from here.
        </Description>

        <Link
          href="/admin/colleges"
          className="block  text-left px-4 py-2 text-md rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        >
          Go to colleges page
        </Link>
      </div>
    </div>
  );
}
