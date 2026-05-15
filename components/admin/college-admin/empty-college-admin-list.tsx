import { Building2 } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { InviteCollegeAdminButton } from "../invite-college-admin-button";
import { Title } from "@/components/ui/text/title";
import { Description } from "@/components/ui/text/description";
import { getColleges } from "@/lib/services/super-admin.service";
import Link from "next/link";

type EmptyCollegeAdminListProps = {
  className?: string;
};

export async function EmptyCollegeAdminList({
  className,
}: EmptyCollegeAdminListProps) {
  const colleges = await getColleges();

  const collegeList = colleges.map((college) => ({
    value: college.id,
    label: college.college_name,
  }));

  return (
    <div
      className={twMerge(
        className,
        "flex flex-col items-center justify-center py-16 px-6 text-center",
      )}
    >
      {colleges.length > 0 ? (
        <>
          <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-gray-100 border border-gray-200 mb-6">
            <Building2 className="w-8 h-8 text-gray-400" />
          </div>

          <Title>No college admin added yet</Title>
          <Description>
            No admin accounts have been configured for the system. Add an admin
            to allow them to oversee operations, manage staff, and control
            access permissions.
          </Description>

          <InviteCollegeAdminButton colleges={collegeList} />
        </>
      ) : (
        <>
          <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-gray-100 border border-gray-200 mb-6">
            <Building2 className="w-8 h-8 text-gray-400" />
          </div>

          <Title>Add a college first</Title>
          <Description>
            You need to add at least one college before you can assign a college
            admin. Once a college is added, you will be able to manage its
            admins from here.
          </Description>

          <Link
            href="/admin/colleges"
            className="block  text-left px-4 py-2 text-md rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          >
            Go to colleges page
          </Link>
        </>
      )}
    </div>
  );
}
