import { Building2 } from "lucide-react";
import AddStudentButton from "./add-student-button";
import { Title } from "@/components/ui/text/title";
import { Description } from "@/components/ui/text/description";

export default async function EmptyStudentsList() {
  return (
    <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
      <div className="mx-auto w-full max-w-[630px] text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gray-100 border border-gray-200 mb-6">
          <Building2 className="w-8 h-8 text-gray-400" />
        </div>

        <Title>No student added yet</Title>
        <Description>
          No student have been configured yet. Add a student to start managing
          student enrollments.
        </Description>

        <AddStudentButton />
      </div>
    </div>
  );
}
