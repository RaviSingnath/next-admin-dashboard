import { TableWrapper } from "@/components/tables/table-wrapper";
import Button from "@/components/ui/button/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTime } from "@/utils/date";
import { DeleteInviteButton } from "../invites/invite-actions/delete/delete-invite-button";
import { ResendInviteButton } from "../invites/invite-actions/resend/resend-invite-button";
import { RevokeInviteButton } from "../invites/invite-actions/revoke-invite-button";
import { SupervisorsListItem } from "@/lib/services/supervisors.services";

type SupervisorsTableProps = {
  supervisors: SupervisorsListItem[];
};

export default async function SupervisorsTable({
  supervisors,
}: SupervisorsTableProps) {
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
              Name
            </TableCell>
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
              Created By
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
              Created At
            </TableCell>
            <TableCell
              isHeader
              className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
            >
              Deleted At
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
          {supervisors.map((supervisor) => (
            <TableRow key={supervisor.id}>
              <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                {supervisor.full_name}
              </TableCell>
              <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                {supervisor.email}
              </TableCell>
              <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                {supervisor.creator?.full_name}
              </TableCell>
              <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                {supervisor.status}
              </TableCell>
              <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                {supervisor.created_at && formatDateTime(supervisor.created_at)}
              </TableCell>
              <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                {supervisor.deleted_at
                  ? formatDateTime(supervisor.deleted_at)
                  : "-"}
              </TableCell>
              <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                <div className="flex gap-2">
                  {supervisor.status === "active" ? (
                    <>
                      <ResendInviteButton inviteID={supervisor.id} />
                      <RevokeInviteButton inviteID={supervisor.id} />
                      <DeleteInviteButton inviteID={supervisor.id} />
                    </>
                  ) : supervisor.status === "suspended" ? (
                    <>
                      <ResendInviteButton inviteID={supervisor.id} />
                      <RevokeInviteButton inviteID={supervisor.id} />
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
