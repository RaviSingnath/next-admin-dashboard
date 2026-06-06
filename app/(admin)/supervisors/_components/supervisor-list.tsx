import ComponentCard from "@/components/common/cmponent-card";
import SupervisorsTable from "./supervisor-table";
import AddSupervisorButton from "./add-supervisor-button";
import { SupervisorsListItem } from "@/lib/services/supervisors.services";
import { getDepartmentsService } from "@/features/departments/department.services";

type SupervisorsListProps = {
  supervisors: SupervisorsListItem[];
};

export default async function SupervisorsList({
  supervisors,
}: SupervisorsListProps) {
  const departments = await getDepartmentsService();

  const departmentList = departments.map((department) => ({
    value: department.id,
    label: department.department_name,
  }));

  return (
    <ComponentCard
      title="Supervisors List"
      ActionButton={<AddSupervisorButton departments={departmentList} />}
    >
      <SupervisorsTable supervisors={supervisors} />
    </ComponentCard>
  );
}
