import ComponentCard from "@/components/common/cmponent-card";
import { InvitesListItem } from "@/features/invite/invite.service";
import { CollegeListItem } from "@/features/colleges/college.service";
import InvitesTable from "./invites-table";
import InviteUserButton from "@/features/invite/components/invite-user-button";

type invitesListProps = {
  invites: InvitesListItem[];
  colleges: CollegeListItem[];
};

export default function InvitesList({ invites, colleges }: invitesListProps) {
  const collegeList = colleges.map((college) => ({
    value: college.id,
    label: college.college_name,
  }));

  return (
    <ComponentCard
      title="Invites List"
      ActionButton={<InviteUserButton colleges={collegeList} />}
    >
      <InvitesTable invites={invites} />
    </ComponentCard>
  );
}
