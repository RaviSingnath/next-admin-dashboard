"use client";

import { Pencil } from "lucide-react";
import { useModal } from "@/hooks/useModal";
import ModalWrapper from "@/components/common/modal-wrapper";
import EditCollegeAddressForm from "./edit-college-address-form";
import { CollegeAddress } from "@/features/colleges/queries/get-college-with-address";

type EditCollegeAddressButtonProps = {
  collegeAddress: CollegeAddress;
};

export default function EditCollegeAddressButton({
  collegeAddress,
}: EditCollegeAddressButtonProps) {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <>
      <button
        onClick={openModal}
        className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
      >
        <Pencil size={18} />
        Edit
      </button>
      <ModalWrapper
        isOpen={isOpen}
        closeModal={closeModal}
        title="Edit Address"
        description="Update your college address to keep your college up-to-date."
      >
        <EditCollegeAddressForm
          collegeAddress={collegeAddress}
          closeModal={closeModal}
        />
      </ModalWrapper>
    </>
  );
}
