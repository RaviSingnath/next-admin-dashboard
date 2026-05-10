import ComponentCard from "@/components/common/ComponentCard";
import { CollegeListItem } from "@/lib/services/super-admin.service";
import { CollegeTable } from "./colleges-table";

type CollegeListProps = {
  colleges: CollegeListItem[];
};

export function CollegeList({ colleges }: CollegeListProps) {
  console.log(colleges);
  return (
    <ComponentCard title="Colleges List">
      <CollegeTable colleges={colleges} />
    </ComponentCard>
  );
}
