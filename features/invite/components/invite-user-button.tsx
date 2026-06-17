"use client";

import { Plus } from "lucide-react";
import Button from "@/components/ui/button/Button";
import { useModal } from "@/hooks/useModal";
import InviteUserModal from "./invite-user-modal";
import InviteUserForm from "./invite-user-form";
import { AppSelectOption } from "@/lib/types/app-types";

type InviteCollegeAdminButtonProps = {
  colleges: AppSelectOption[];
};

export default function InviteUserButton({
  colleges,
}: InviteCollegeAdminButtonProps) {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <>
      <Button onClick={openModal} size="sm">
        <Plus className="w-4 h-4" />
        Invite student
      </Button>
      <InviteUserModal isOpen={isOpen} closeModal={closeModal}>
        <InviteUserForm colleges={colleges} closeModal={closeModal} />
      </InviteUserModal>
    </>
  );
}
