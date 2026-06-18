import { Modal } from "@/components/ui/modal";

type InviteCollegeAdminModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  children: React.ReactNode;
};

export default function InviteUserModal({
  isOpen,
  closeModal,
  children,
}: InviteCollegeAdminModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      className="max-w-[700px] m-4 text-start"
    >
      <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Invite user
          </h4>

          <p className="mb-3 text-sm text-gray-500 dark:text-gray-400 lg:mb-3">
            Enter the email below to register a new user.
          </p>
        </div>

        {children}
      </div>
    </Modal>
  );
}
