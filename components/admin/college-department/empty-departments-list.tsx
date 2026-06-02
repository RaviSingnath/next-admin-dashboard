import { Building2 } from "lucide-react";
import AddDepartmentButton from "./add-department-button";
import Title from "@/components/ui/text/title";
import Description from "@/components/ui/text/description";

type EmptyDepartmentsListProps = {
  className?: string;
};

export default async function EmptyDepartmentsList({
  className,
}: EmptyDepartmentsListProps) {
  return (
    <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
      <div className="mx-auto w-full max-w-[630px] text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gray-100 border border-gray-200 mb-6">
          <Building2 className="w-8 h-8 text-gray-400" />
        </div>

        <Title>No department added yet</Title>
        <Description>
          No departments have been configured for this college yet. Add a
          department to start managing courses, faculty, and student
          enrollments.
        </Description>

        <AddDepartmentButton />
      </div>
    </div>
  );
}
