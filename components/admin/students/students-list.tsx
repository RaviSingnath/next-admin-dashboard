import ComponentCard from "@/components/common/ComponentCard";
import { StudentsListItem } from "@/lib/services/student.service";
import AddStudentButton from "./add-student-button";
import StudentsTable from "./students-table";

type StudentsListProps = {
  students: StudentsListItem[];
};

export default async function StudentsList({ students }: StudentsListProps) {
  return (
    <ComponentCard title="Students List" ActionButton={<AddStudentButton />}>
      <StudentsTable students={students} />
    </ComponentCard>
  );
}
