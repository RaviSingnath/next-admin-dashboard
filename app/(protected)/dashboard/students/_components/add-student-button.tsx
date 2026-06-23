"use client";

import { Plus } from "lucide-react";
import { useModal } from "@/hooks/useModal";
import Button from "@/components/ui/button/Button";
import InviteStudentModal from "./invite-student-modal";
import InviteUserForm from "@/features/invite/components/invite-user-form";

export default function AddStudentButton() {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <>
      <Button onClick={openModal} size="sm">
        <Plus className="w-4 h-4" />
        Add Student
      </Button>
      <InviteStudentModal isOpen={isOpen} closeModal={closeModal}>
        <InviteUserForm closeModal={closeModal} />
      </InviteStudentModal>
    </>
  );
}
