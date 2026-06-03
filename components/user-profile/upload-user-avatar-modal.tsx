import { Modal } from "@/components/ui/modal";

type UploadUserAvatarModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  children: React.ReactNode;
};

export default function UploadUserAvatarModal({
  isOpen,
  closeModal,
  children,
}: UploadUserAvatarModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      className="max-w-140 m-4 text-start"
    >
      <div className="no-scrollbar relative w-full max-w-140 overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Upload Avatar
          </h4>

          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Adding a photo personalizes your account and helps people recognize.
          </p>
        </div>

        {children}
      </div>
    </Modal>
  );
}
