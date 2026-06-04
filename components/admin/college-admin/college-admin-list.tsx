import ComponentCard from "@/components/common/cmponent-card";
import { CollegeAdminListItem } from "@/lib/services/super-admin.service";
import CollegeAdminsTable from "./college-admins-table";
import InviteCollegeAdminButton from "./invite-college-admin-button";
import { CollegeListItem } from "@/features/colleges/college.service";

type CollegeAdminsListProps = {
  collegeAdmins: CollegeAdminListItem[];
  colleges: CollegeListItem[];
};

export default async function CollegeAdminsList({
  colleges,
  collegeAdmins,
}: CollegeAdminsListProps) {
  const collegeList = colleges.map((college) => ({
    value: college.id,
    label: college.college_name,
  }));

  return (
    <ComponentCard
      title="College Admins List"
      ActionButton={<InviteCollegeAdminButton colleges={collegeList} />}
    >
      <CollegeAdminsTable collegeAdmins={collegeAdmins} />
    </ComponentCard>
  );
}
