"use client";

import { Modal } from "@/components/ui/modal";
import AddCollegeForm from "@/components/form/admin/add-college-form";

type AddCollegeModalProps = {
  isOpen: boolean;
  closeModal: () => void;
};

export function AddCollegeModal({ isOpen, closeModal }: AddCollegeModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      className="max-w-[700px] m-4 text-start"
    >
      <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Add College
          </h4>

          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Enter the details below to register a new college.
          </p>
        </div>

        <AddCollegeForm closeModal={closeModal} />
      </div>
    </Modal>
  );
}
