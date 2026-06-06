"use client";

import { Plus } from "lucide-react";
import Button from "@/components/ui/button/Button";
import { useModal } from "@/hooks/useModal";
import InviteCollegeAdminModal from "./invite-college-admin-modal";
import InviteCollegeAdminForm from "./invite-college-admin-form";

type InviteCollegeAdminButtonProps = {
  colleges: { value: string; label: string }[];
};

export default function InviteCollegeAdminButton({
  colleges,
}: InviteCollegeAdminButtonProps) {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <>
      <Button onClick={openModal} size="sm">
        <Plus className="w-4 h-4" />
        Invite college admin
      </Button>
      <InviteCollegeAdminModal isOpen={isOpen} closeModal={closeModal}>
        <InviteCollegeAdminForm options={colleges} closeModal={closeModal} />
      </InviteCollegeAdminModal>
    </>
  );
}
