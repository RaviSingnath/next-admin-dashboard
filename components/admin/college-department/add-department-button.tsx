"use client";

import { Plus } from "lucide-react";
import Button from "@/components/ui/button/Button";
import { useModal } from "@/hooks/useModal";
import AddDepartmentForm from "./AddDepartmentForm";
import { AddDepartmentModal } from "./AddDepartmentModal";

export function AddDepartmentButton() {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <>
      <Button onClick={openModal} size="sm">
        <Plus className="w-4 h-4" />
        Add Department
      </Button>
      <AddDepartmentModal isOpen={isOpen} closeModal={closeModal}>
        <AddDepartmentForm closeModal={closeModal} />
      </AddDepartmentModal>
    </>
  );
}
