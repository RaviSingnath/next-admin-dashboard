import ComponentCard from "@/components/common/ComponentCard";
import {
  CollegeListItem,
  InvitesListItem,
} from "@/lib/services/super-admin.service";
import InvitesTable from "./invites-table";
import { InviteCollegeAdminButton } from "../college-admin/invite-college-admin-button";

type invitesListProps = {
  invites: InvitesListItem[];
  colleges: CollegeListItem[];
};

export async function InvitesList({ invites, colleges }: invitesListProps) {
  const collegeList = colleges.map((college) => ({
    value: college.id,
    label: college.college_name,
  }));

  return (
    <ComponentCard
      title="Invites List"
      ActionButton={<InviteCollegeAdminButton colleges={collegeList} />}
    >
      <InvitesTable invites={invites} />
    </ComponentCard>
  );
}
