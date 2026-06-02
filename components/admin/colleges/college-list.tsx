import ComponentCard from "@/components/common/cmponent-card";
import { CollegeListItem } from "@/lib/services/super-admin.service";
import CollegeTable from "./colleges-table";
import AddCollegeButton from "../add-college-button";

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
