import { TableWrapper } from "@/components/tables/table-wrapper";
import Button from "@/components/ui/button/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InvitesListItem } from "@/lib/services/super-admin.service";
import { formatDateTime } from "@/utils/date";
import { DeleteInviteButton } from "./invite-actions/delete/delete-invite-button";
import { ResendInviteButton } from "./invite-actions/resend/resend-invite-button";
import { RevokeInviteButton } from "./invite-actions/revoke-invite-button";

type InvitesTableProps = {
  invites: InvitesListItem[];
};

export async function InvitesTable({ invites }: InvitesTableProps) {
  console.log(invites);
  return (
    <TableWrapper>
      <Table>
        {/* Table Header */}
        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
          <TableRow>
            <TableCell
              isHeader
              className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
            >
              Email
            </TableCell>
            <TableCell
              isHeader
              className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
            >
              College Name
            </TableCell>
            <TableCell
              isHeader
              className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
            >
              Invited By
            </TableCell>
            <TableCell
              isHeader
              className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
            >
              Status
            </TableCell>
            <TableCell
              isHeader
              className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
            >
              Accepted At
            </TableCell>
            <TableCell
              isHeader
              className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
            >
              Created At
            </TableCell>
            <TableCell
              isHeader
              className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
            >
              Action
            </TableCell>
          </TableRow>
        </TableHeader>
        {/* Table Body */}
        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
          {invites.map((invite) => (
            <TableRow key={invite.id}>
              <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                {invite.email}
              </TableCell>
              <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                {invite.college && invite.college.college_name}
              </TableCell>
              <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                {invite.invited_by_profile.full_name}
              </TableCell>
              <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                {invite.status}
              </TableCell>
              <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                {invite.accepted_at ? formatDateTime(invite.accepted_at) : "-"}
              </TableCell>
              <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                {invite.created_at && formatDateTime(invite.created_at)}
              </TableCell>
              <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                <div className="flex gap-2">
                  {invite.status === "pending" ? (
                    <>
                      <ResendInviteButton inviteID={invite.id} />
                      <RevokeInviteButton inviteID={invite.id} />
                      <DeleteInviteButton inviteID={invite.id} />
                    </>
                  ) : invite.status === "onboarding" ? (
                    <>
                      <ResendInviteButton inviteID={invite.id} />
                      <RevokeInviteButton inviteID={invite.id} />
                    </>
                  ) : (
                    <Button size="sm">View</Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableWrapper>
  );
}
