"use client";

import { Plus } from "lucide-react";
import { useModal } from "@/hooks/useModal";
import Button from "@/components/ui/button/Button";
import InviteStudentModal from "./invite-student-modal";
import InviteStudentForm from "./invite-student-form";

export default function AddStudentButton() {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <>
      <Button onClick={openModal} size="sm">
        <Plus className="w-4 h-4" />
        Add Supervisor
      </Button>
      <InviteStudentModal isOpen={isOpen} closeModal={closeModal}>
        <InviteStudentForm closeModal={closeModal} />
      </InviteStudentModal>
    </>
  );
}
