"use client";

import { useModal } from "@/hooks/useModal";
import RevertDepartmentModal from "./revert-department-modal";
import { Undo2 } from "lucide-react";
import { Tooltip } from "react-tooltip";

type RevertDepartmentButtonProps = {
  departmentID: string;
};

export const RevertDepartmentButton = ({
  departmentID,
}: RevertDepartmentButtonProps) => {
  const { isOpen, openModal, closeModal } = useModal();
  return (
    <>
      <Undo2
        onClick={openModal}
        size={16}
        className="delete-department cursor-pointer"
      ></Undo2>
      <Tooltip anchorSelect=".delete-department" place="top">
        Revert department
      </Tooltip>
      <RevertDepartmentModal
        departmentID={departmentID}
        isOpen={isOpen}
        closeModal={closeModal}
      />
    </>
  );
};
