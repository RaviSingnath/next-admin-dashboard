"use client";

import { Plus } from "lucide-react";
import Button from "@/components/ui/button/Button";
import { useModal } from "@/hooks/useModal";
import InviteCollegeAdminModal from "./invite-college-admin-modal";
import InviteUserForm from "@/features/invite/components/invite-user-form";
import { CollegeListItem } from "@/features/colleges/college.service";

type InviteCollegeAdminButtonProps = {
  colleges: CollegeListItem[];
};

export default function InviteCollegeAdminButton({
  colleges,
}: InviteCollegeAdminButtonProps) {
  const { isOpen, openModal, closeModal } = useModal();

  const collegeList = colleges.map((college) => ({
    value: college.id,
    label: college.college_name,
  }));

  return (
    <>
      <Button onClick={openModal} size="sm">
        <Plus className="w-4 h-4" />
        Add college admin
      </Button>
      <InviteCollegeAdminModal isOpen={isOpen} closeModal={closeModal}>
        <InviteUserForm closeModal={closeModal} colleges={collegeList} />
      </InviteCollegeAdminModal>
    </>
  );
}
