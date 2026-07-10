"use client";
import { Pencil } from "lucide-react";
import { useModal } from "@/hooks/useModal";
import EditPlanModal from "./edit-plan-modal";
import EditPlanForm from "./edit-plan-form";
import { SubscriptionPlan } from "@/features/stripe/stripe.queries";

type EditPlanButtonProps = {
  plan: SubscriptionPlan;
};

export default function EditPlanButton({ plan }: EditPlanButtonProps) {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <div className="absolute top-0 right-0">
      <button
        onClick={openModal}
        className="flex w-full rounded-full border border-brand-400 bg-white p-1 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
      >
        <Pencil size={14} className="text-brand-500 dark:text-gray-500" />
      </button>
      <EditPlanModal isOpen={isOpen} closeModal={closeModal}>
        <EditPlanForm closeModal={closeModal} plan={plan} />
      </EditPlanModal>
    </div>
  );
}
