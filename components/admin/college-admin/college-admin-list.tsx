import ComponentCard from "@/components/common/cmponent-card";
import { CollegeAdminListItem } from "@/lib/services/super-admin.service";
import CollegeAdminsTable from "./college-admins-table";
import InviteCollegeAdminButton from "./invite-college-admin-button";
import { getColleges } from "@/lib/services/super-admin.service";

type CollegeAdminsListProps = {
  collegeAdmins: CollegeAdminListItem[];
};

export default async function CollegeAdminsList({
  collegeAdmins,
}: CollegeAdminsListProps) {
  const colleges = await getColleges();

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
