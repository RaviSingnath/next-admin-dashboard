"use client";

import { useModal } from "@/hooks/useModal";
import DeleteDepartmentModal from "./delete-department-modal";
import { Trash2 } from "lucide-react";
import { Tooltip } from "react-tooltip";

type DeleteDepartmentButtonProps = {
  departmentID: string;
};

export const DeleteDepartmentButton = ({
  departmentID,
}: DeleteDepartmentButtonProps) => {
  const { isOpen, openModal, closeModal } = useModal();
  return (
    <>
      <Trash2
        onClick={openModal}
        size={16}
        className="delete-department cursor-pointer"
      ></Trash2>
      <Tooltip anchorSelect=".delete-department" place="top">
        Delete department
      </Tooltip>
      <DeleteDepartmentModal
        departmentID={departmentID}
        isOpen={isOpen}
        closeModal={closeModal}
      />
    </>
  );
};
