"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthProvider";

import FormWrapper from "@/components/common/form-wrapper";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { zAdminPlan, TAdminPlan } from "../plan.schema";
import handleFormSubmit from "@/lib/helper/handle-form-submit";
import { updatePlanAction } from "@/app/(protected)/admin/plans/_lib/plan.actions";
import { SubscriptionPlan } from "@/features/stripe/stripe.queries";

type EditPlanFormProps = {
  closeModal: () => void;
  plan: SubscriptionPlan;
};

export default function EditPlanForm({ closeModal, plan }: EditPlanFormProps) {
  const { user } = useAuth();

  const form = useForm<TAdminPlan>({
    resolver: zodResolver(zAdminPlan),
    defaultValues: {
      display_order: 0,
    },
  });

  const {
    register,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (formData: TAdminPlan) => {
    await handleFormSubmit({
      action: () => updatePlanAction(plan.id, formData),
      setError,
      successMessage: "Plan updated successfully",
      onSuccess: () => {
        reset();
        closeModal();
      },
    });
  };

  return (
    <FormWrapper
      form={form}
      closeModal={closeModal}
      onSubmit={onSubmit}
      isPending={isSubmitting}
      submitLabel="Update"
      pendingLabel="Updating..."
    >
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
        <div className="lg:col-span-2">
          <Label>Search Address</Label>
        </div>

        <div>
          <Label>Display Order</Label>
          <Input
            type="number"
            error={!!errors.display_order}
            hint={errors.display_order?.message}
            {...register("display_order", { valueAsNumber: true })}
          />
        </div>
      </div>
    </FormWrapper>
  );
}
