import { Modal } from "@/components/ui/modal";

type ModalWrapperProps = {
  isOpen: boolean;
  closeModal: () => void;
  children: React.ReactNode;
  title: string;
  description: string;
};

export default function ModalWrapper({
  isOpen,
  closeModal,
  children,
  title,
  description,
}: ModalWrapperProps) {
  return (
    <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
      <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            {title}
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            {description}
          </p>
        </div>
        {children}
      </div>
    </Modal>
  );
}
