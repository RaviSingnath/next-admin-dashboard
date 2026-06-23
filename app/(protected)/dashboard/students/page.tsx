import { Metadata } from "next";
import PageWrapperBreadcrumb from "@/components/layout/page-wrapper-breadcrumb";
import { getStudentsService } from "@/features/students/students.services";
import EmptyStudentsList from "./_components/empty-students-list";
import StudentsList from "./_components/students-list";

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
