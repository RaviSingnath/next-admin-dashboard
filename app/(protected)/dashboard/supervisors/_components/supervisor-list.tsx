import ComponentCard from "@/components/common/cmponent-card";
import SupervisorsTable from "./supervisor-table";
import AddSupervisorButton from "./add-supervisor-button";
import { SupervisorsListItem } from "@/features/supervisors/supervisors.services";

type SupervisorsListProps = {
  supervisors: SupervisorsListItem[];
};

export default async function SupervisorsList({
  supervisors,
}: SupervisorsListProps) {
  return (
    <ComponentCard
      title="Supervisors List"
      ActionButton={<AddSupervisorButton />}
    >
      <SupervisorsTable supervisors={supervisors} />
    </ComponentCard>
  );
}
