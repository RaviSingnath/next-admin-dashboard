import ComponentCard from "@/components/common/ComponentCard";
import { SupervisorsTable } from "./supervisor-table";
import { AddSupervisorButton } from "./add-supervisor-button";
import { SupervisorsListItem } from "@/lib/services/supervisors.services";
import { getDepartmentsService } from "@/lib/services/depatments.service";

type SupervisorsListProps = {
  supervisors: SupervisorsListItem[];
};

export async function SupervisorsList({ supervisors }: SupervisorsListProps) {
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
