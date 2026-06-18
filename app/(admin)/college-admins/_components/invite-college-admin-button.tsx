"use client";

import { Plus } from "lucide-react";
import Button from "@/components/ui/button/Button";
import { useModal } from "@/hooks/useModal";
import InviteCollegeAdminModal from "./invite-college-admin-modal";
import InviteUserForm from "@/features/invite/components/invite-user-form";

export default function InviteCollegeAdminButton() {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <>
      <Button onClick={openModal} size="sm">
        <Plus className="w-4 h-4" />
        Add college admin
      </Button>
      <InviteCollegeAdminModal isOpen={isOpen} closeModal={closeModal}>
        <InviteUserForm closeModal={closeModal} />
      </InviteCollegeAdminModal>
    </>
  );
}
