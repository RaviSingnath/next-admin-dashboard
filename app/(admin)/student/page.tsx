import { Metadata } from "next";
import PageWrapperBreadcrumb from "@/components/layout/page-wrapper-breadcrumb";
import { getStudentsService } from "@/lib/services/student.service";
import EmptyStudentsList from "@/components/admin/students/empty-students-list";
import StudentsList from "@/components/admin/students/students-list";

export const metadata: Metadata = {
  title: "Students page",
  description: "This is a students page.",
};

export default async function StudentsPage() {
  const students = await getStudentsService();

  return (
    <PageWrapperBreadcrumb title="Students">
      {students.length > 0 ? (
        <StudentsList students={students} />
      ) : (
        <EmptyStudentsList />
      )}
    </PageWrapperBreadcrumb>
  );
}
