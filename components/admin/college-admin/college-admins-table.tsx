import { TableWrapper } from "@/components/tables/table-wrapper";
import Button from "@/components/ui/button/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CollegeAdminListItem } from "@/lib/services/super-admin.service";
import { formatDateTime } from "@/utils/date";
import { DeleteInviteButton } from "../invites/invite-actions/delete/delete-invite-button";
import { ResendInviteButton } from "../invites/invite-actions/resend/resend-invite-button";
import { RevokeInviteButton } from "../invites/invite-actions/revoke-invite-button";

type CollegeAdminsTableProps = {
  collegeAdmins: CollegeAdminListItem[];
};

export default async function CollegeAdminsTable({
  collegeAdmins,
}: CollegeAdminsTableProps) {
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
              College Name
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
          {collegeAdmins.map((collegeAdmin) => (
            <TableRow key={collegeAdmin.id}>
              <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                {collegeAdmin.full_name}
              </TableCell>
              <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                {collegeAdmin.email}
              </TableCell>
              <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                {collegeAdmin.creator?.full_name}
              </TableCell>
              <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                {collegeAdmin.college?.college_name}
              </TableCell>
              <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                {collegeAdmin.status}
              </TableCell>
              <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                {collegeAdmin.created_at &&
                  formatDateTime(collegeAdmin.created_at)}
              </TableCell>
              <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                {collegeAdmin.deleted_at
                  ? formatDateTime(collegeAdmin.deleted_at)
                  : "-"}
              </TableCell>
              <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                <div className="flex gap-2">
                  {collegeAdmin.status === "active" ? (
                    <>
                      <ResendInviteButton inviteID={collegeAdmin.id} />
                      <RevokeInviteButton inviteID={collegeAdmin.id} />
                      <DeleteInviteButton inviteID={collegeAdmin.id} />
                    </>
                  ) : collegeAdmin.status === "suspended" ? (
                    <>
                      <ResendInviteButton inviteID={collegeAdmin.id} />
                      <RevokeInviteButton inviteID={collegeAdmin.id} />
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
