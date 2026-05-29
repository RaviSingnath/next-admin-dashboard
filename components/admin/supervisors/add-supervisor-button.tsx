"use client";

import { Plus } from "lucide-react";
import Button from "@/components/ui/button/Button";
import { useModal } from "@/hooks/useModal";
import { AddsupervisortModal } from "./add-supervisor-modal";
import InviteSupervisorForm from "./add-supervisor-form";

type AddSupervisorButtonProps = {
  departments: { value: string; label: string }[];
};

export function AddSupervisorButton({ departments }: AddSupervisorButtonProps) {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <>
      <Button onClick={openModal} size="sm">
        <Plus className="w-4 h-4" />
        Add Supervisor
      </Button>
      <AddsupervisortModal isOpen={isOpen} closeModal={closeModal}>
        <InviteSupervisorForm options={departments} closeModal={closeModal} />
      </AddsupervisortModal>
    </>
  );
}
