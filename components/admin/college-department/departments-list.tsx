import ComponentCard from "@/components/common/cmponent-card";
import AddDepartmentButton from "./add-department-button";
import DepartmentsTable from "./departments-table";
import { DepartmentsListItem } from "@/lib/services/depatments.service";

type DepartmentsListProps = {
  departments: DepartmentsListItem[];
};

export default async function DepartmentsList({
  departments,
}: DepartmentsListProps) {
  return (
    <ComponentCard
      title="Departments List"
      ActionButton={<AddDepartmentButton />}
    >
      <DepartmentsTable departments={departments} />
    </ComponentCard>
  );
}
