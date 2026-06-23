"use client";

import TableWrapper from "@/components/tables/table-wrapper";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DepartmentsListItem } from "@/features/departments/department.services";
import { formatDateTime } from "@/utils/date";
import DeleteDepartmentButton from "./delete-department-button";
import CheckboxField from "@/components/form/input/check-box-field";
import { createQueryString } from "@/lib/helper/update-search-params";
import { useSearchParams, useRouter } from "next/navigation";
import RevertDepartmentButton from "./revert-department-button";

type DepartmentsTableProps = {
  departments: DepartmentsListItem[];
};

export default function DepartmentsTable({
  departments,
}: DepartmentsTableProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const includeDeleted =
    searchParams.get("includeDeleted") === "true" ? true : false;

  const handleIncludeDeleted = (checked: boolean) => {
    const query = createQueryString(new URLSearchParams(searchParams), {
      includeDeleted: checked ? true : null,
    });

    router.push(`/departments?${query}`);
  };

  return (
    <>
      <div className="flex justify-end items-center gap-2">
        <CheckboxField
          checked={includeDeleted}
          onChange={handleIncludeDeleted}
        />
        Include deleted
      </div>
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
                Created By
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
            {departments.map((department) => (
              <TableRow key={department.id}>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {department.department_name}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {department.creator?.full_name}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {department.created_at &&
                    formatDateTime(department.created_at)}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <div className="flex gap-2">
                    {department.deleted_at ? (
                      <RevertDepartmentButton departmentID={department.id} />
                    ) : (
                      <DeleteDepartmentButton departmentID={department.id} />
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableWrapper>
    </>
  );
}
