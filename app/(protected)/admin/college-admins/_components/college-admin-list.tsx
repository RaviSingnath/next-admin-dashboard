import ComponentCard from "@/components/common/cmponent-card";
import { CollegeAdminsListItem } from "@/features/college-admins/college-admin.services";
import CollegeAdminsTable from "./college-admins-table";
import InviteCollegeAdminButton from "./invite-college-admin-button";
import { CollegeListItem } from "@/features/colleges/college.service";

type CollegeAdminsListProps = {
  collegeAdmins: CollegeAdminsListItem[];
  colleges: CollegeListItem[];
};

export default async function CollegeAdminsList({
  collegeAdmins,
  colleges,
}: CollegeAdminsListProps) {
  return (
    <ComponentCard
      title="College Admins List"
      ActionButton={<InviteCollegeAdminButton colleges={colleges} />}
    >
      <CollegeAdminsTable collegeAdmins={collegeAdmins} />
    </ComponentCard>
  );
}
