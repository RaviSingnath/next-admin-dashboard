import ComponentCard from "@/components/common/ComponentCard";
import { AddDepartmentButton } from "./add-department-button";
import { DepartmentsTable } from "./DepartmentsTable";
import { DepartmentsListItem } from "@/lib/services/depatments.service";

type DepartmentsListProps = {
  departments: DepartmentsListItem[];
};

export async function DepartmentsList({ departments }: DepartmentsListProps) {
  return (
    <ComponentCard
      title="Departments List"
      ActionButton={<AddDepartmentButton />}
    >
      <DepartmentsTable departments={departments} />
    </ComponentCard>
  );
}
