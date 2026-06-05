import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { softDeleteDepartmentAction } from "../_lib/department.actions";
import { handleActionError } from "@/lib/helper/handle-action-error";
import { appToast } from "@/lib/toast";

type DeleteDepartmentModalProps = {
  departmentID: string;
  isOpen: boolean;
  closeModal: () => void;
};

export default function DeleteDepartmentModal({
  departmentID,
  isOpen,
  closeModal,
}: DeleteDepartmentModalProps) {
  const router = useRouter();
  const handleDeleteUser = async (id: string) => {
    try {
      const result = await softDeleteDepartmentAction(id);

      if (!result.success) {
        handleActionError(result, router);

        return;
      }

      appToast.success("Department deleted successfully");

      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      className="max-w-[700px] m-4 text-start"
    >
      <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Delete Department
          </h4>

          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Are you sure want to delete department?
          </p>
        </div>

        <div className="mt-6 flex items-center gap-3 px-2 md:justify-end">
          <Button onClick={closeModal} size="sm">
            Close
          </Button>
          <Button onClick={() => handleDeleteUser(departmentID)} size="sm">
            delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
