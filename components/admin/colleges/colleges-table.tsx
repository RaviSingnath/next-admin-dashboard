import { CollegeListItem } from "@/lib/services/super-admin.service";
import TableWrapper from "@/components/tables/table-wrapper";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Badge from "@/components/ui/badge/Badge";
import Image from "next/image";
import { formatDateTime } from "@/utils/date";

type CollegeTableProps = {
  colleges: CollegeListItem[];
};

export default function CollegeTable({ colleges }: CollegeTableProps) {
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
              Phone
            </TableCell>
            <TableCell
              isHeader
              className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
            >
              Team
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
              Stripe Active
            </TableCell>
            <TableCell
              isHeader
              className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
            >
              Created At
            </TableCell>
          </TableRow>
        </TableHeader>
        {/* Table Body */}
        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
          {colleges.map((college) => (
            <TableRow key={college.id}>
              <TableCell className="px-5 py-4 sm:px-6 text-start">
                <div className="flex items-center gap-3">
                  {college.logo_url ? (
                    <div className="w-10 h-10 overflow-hidden rounded-full">
                      <Image
                        width={40}
                        height={40}
                        src={college.logo_url}
                        alt={college.college_name}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full dark:bg-gray-800">
                      <div className="text-gray-800 font-semibold font-medium dark:text-white/90">
                        {college.college_name.charAt(0)}
                      </div>
                    </div>
                  )}

                  <div>
                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {college.college_name}
                    </span>
                    <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                      {college.official_email}
                    </span>
                    <span className="flex gap-1 text-gray-500 text-theme-xs dark:text-gray-400">
                      {college.country}{" "}
                      <span className="text-gray-800 dark:text-white/90">
                        |
                      </span>{" "}
                      {college.phone}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                {college.phone}
              </TableCell>
              <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                <div className="flex -space-x-2">
                  {college.profiles.length > 0
                    ? college.profiles.map((profile, index) => (
                        <div
                          key={index}
                          className="w-6 h-6 overflow-hidden border-2 border-white rounded-full dark:border-gray-900"
                        >
                          {profile.avatar ? (
                            <Image
                              width={24}
                              height={24}
                              src={profile.avatar}
                              alt={`Team member ${index + 1}`}
                              className="w-full"
                            />
                          ) : (
                            <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full dark:bg-gray-800">
                              <div className="text-gray-800 font-semibold font-medium dark:text-white/90">
                                {profile.full_name &&
                                  profile.full_name.charAt(0)}
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    : "-"}
                </div>
              </TableCell>
              <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                <Badge
                  size="sm"
                  color={
                    college.status === "active"
                      ? "success"
                      : college.status === "pending"
                        ? "warning"
                        : "error"
                  }
                >
                  {college.status}
                </Badge>
              </TableCell>
              <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                <Badge
                  size="sm"
                  color={
                    college.stripe_connected_account_id === null
                      ? "error"
                      : "success"
                  }
                >
                  {college.stripe_connected_account_id === null
                    ? "not active"
                    : "active"}
                </Badge>
              </TableCell>
              <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                {college.created_at && formatDateTime(college.created_at)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableWrapper>
  );
}
