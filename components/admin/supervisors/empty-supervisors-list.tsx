import { Building2 } from "lucide-react";
import Link from "next/link";
import { AddSupervisorButton } from "./add-supervisor-button";
import { Title } from "@/components/ui/text/title";
import { Description } from "@/components/ui/text/description";
import { getDepartmentsService } from "@/lib/services/depatments.service";

export async function EmptySupervisorList() {
  const departments = await getDepartmentsService();

  const departmentOptions = departments.map((department) => ({
    value: department.id,
    label: department.department_name,
  }));
  return (
    <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
      <div className="mx-auto w-full max-w-[630px] text-center">
        {departments.length > 0 ? (
          <>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gray-100 border border-gray-200 mb-6">
              <Building2 className="w-8 h-8 text-gray-400" />
            </div>

            <Title>No supervisor added yet</Title>
            <Description>
              No supervisor have been configured yet. Add a supervisor to start
              managing courses, faculty, and student enrollments.
            </Description>

            <AddSupervisorButton departments={departmentOptions} />
          </>
        ) : (
          <>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gray-100 border border-gray-200 mb-6">
              <Building2 className="w-8 h-8 text-gray-400" />
            </div>

            <Title>Add a department first</Title>
            <Description>
              You need to add at least one department before you can assign a
              college admin. Once a department is added, you will be able to
              manage its supervisor from here.
            </Description>

            <Link
              href="/college-admin/departments"
              className="inline-flex text-left px-4 py-2 text-md rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              Go to deaprtment page
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
