import { Building2 } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { AddCollegeAdminButton } from "./add-college-admin-button";
import { Title } from "../ui/text/title";
import { Description } from "../ui/text/description";

type EmptyCollegeAdminListProps = {
  className?: string;
};

export function EmptyCollegeAdminList({
  className,
}: EmptyCollegeAdminListProps) {
  return (
    <div
      className={twMerge(
        className,
        "flex flex-col items-center justify-center py-16 px-6 text-center",
      )}
    >
      <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-gray-100 border border-gray-200 mb-6">
        <Building2 className="w-8 h-8 text-gray-400" />
      </div>

      <Title>No college admin added yet</Title>
      <Description>
        No admin accounts have been configured for the system. Add an admin
        to allow them to oversee operations, manage staff, and control access
        permissions.
      </Description>

      <AddCollegeAdminButton />
    </div>
  );
}
