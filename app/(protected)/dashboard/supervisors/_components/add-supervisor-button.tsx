"use client";

import { Plus } from "lucide-react";
import Button from "@/components/ui/button/Button";
import { useModal } from "@/hooks/useModal";
import AddsupervisortModal from "./add-supervisor-modal";
import InviteUserForm from "@/features/invite/components/invite-user-form";

export default function AddSupervisorButton() {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <>
      <Button onClick={openModal} size="sm">
        <Plus className="w-4 h-4" />
        Add Supervisor
      </Button>
      <AddsupervisortModal isOpen={isOpen} closeModal={closeModal}>
        <InviteUserForm closeModal={closeModal} />
      </AddsupervisortModal>
    </>
  );
}
