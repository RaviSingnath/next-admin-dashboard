import { Building2 } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { AddCollegeButton } from "./add-college-button";
import { Title } from "../ui/text/title";
import { Description } from "../ui/text/description";

type EmptyCollegeListProps = {
  className?: string;
};

export function EmptyCollegeList({ className }: EmptyCollegeListProps) {
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

      <Title>No colleges added yet</Title>
      <Description>
        No colleges have been configured in the system. Add your first college
        to start managing campuses, departments, and student access.
      </Description>

      <AddCollegeButton />
    </div>
  );
}
