"use client";

import { Plus } from "lucide-react";
import Button from "../ui/button/Button";
import { useModal } from "@/hooks/useModal";
import AddCollegeModal from "./modal/add-college-modal";

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
