"use client";

import { Plus } from "lucide-react";
import Button from "../ui/button/Button";
import { useModal } from "@/hooks/useModal";
import { InviteCollegeAdminModal } from "./modal/invite-college-admin-modal";

export function InviteCollegeAdminButton() {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <>
      <Button onClick={openModal} size="sm">
        <Plus className="w-4 h-4" />
        Invite college admin
      </Button>
      <InviteCollegeAdminModal isOpen={isOpen} closeModal={closeModal} />
    </>
  );
}
