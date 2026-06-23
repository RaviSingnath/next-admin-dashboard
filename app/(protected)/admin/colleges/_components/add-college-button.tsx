"use client";

import { Plus } from "lucide-react";
import { useModal } from "@/hooks/useModal";
import Button from "@/components/ui/button/Button";
import AddCollegeModal from "./add-college-modal";

export default function AddCollegeButton() {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <>
      <Button onClick={openModal} size="sm">
        <Plus className="w-4 h-4" />
        Add college
      </Button>
      <AddCollegeModal isOpen={isOpen} closeModal={closeModal} />
    </>
  );
}
