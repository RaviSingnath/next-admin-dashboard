import ComponentCard from "@/components/common/cmponent-card";
import CollegeTable from "./colleges-table";
import AddCollegeButton from "./add-college-button";
import { CollegeListItem } from "@/lib/services/super-admin.service";

type CollegeListProps = {
  colleges: CollegeListItem[];
};

export default function CollegeList({ colleges }: CollegeListProps) {
  return (
    <ComponentCard title="Colleges List" ActionButton={<AddCollegeButton />}>
      <CollegeTable colleges={colleges} />
    </ComponentCard>
  );
}
