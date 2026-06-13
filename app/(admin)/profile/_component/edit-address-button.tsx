import { Pencil } from "lucide-react";
import { useModal } from "@/hooks/useModal";
import EditAddressModal from "./edit-address-modal";
import EditAddressForm from "./edit-address-form";

export default function EditAddressButton() {
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
      <EditAddressModal isOpen={isOpen} closeModal={closeModal}>
        <EditAddressForm closeModal={closeModal} />
      </EditAddressModal>
    </>
  );
}
