"use client";

import { useFieldArray, useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormWrapper from "@/components/common/form-wrapper";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { zAdminPlan, TAdminPlan } from "../plan.schema";
import handleFormSubmit from "@/lib/helper/handle-form-submit";
import { updatePlanAction } from "@/app/(protected)/admin/plans/_lib/plan.actions";
import { SubscriptionPlan } from "@/features/stripe/stripe.queries";
import PlanFeatureInput from "./plan-feature-input";
import { Plus } from "lucide-react";
import Button from "@/components/ui/button/Button";

type EditPlanFormProps = {
  closeModal: () => void;
  plan: SubscriptionPlan;
};

export default function EditPlanForm({ closeModal, plan }: EditPlanFormProps) {
  const form = useForm<TAdminPlan>({
    resolver: zodResolver(zAdminPlan),
    defaultValues: {
      display_order: plan.display_order,
      features: plan.features.map((feature) => ({
        id: feature.id,
        feature: feature.feature,
        display_order: feature.display_order,
      })),
    },
  });

  const {
    control,
    register,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = form;
  const { fields, append, remove } = useFieldArray({
    name: "features",
    control,
  });

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
          <Label>Position</Label>
          <Input
            type="number"
            error={!!errors.display_order}
            hint={errors.display_order?.message}
            {...register("display_order", { valueAsNumber: true })}
          />
        </div>

        <div className="lg:col-span-2">
          <Label>Features</Label>
          <div className="flex flex-col items-start justify-center gap-2">
            <FormProvider {...form}>
              {fields.map((field, index) => (
                <PlanFeatureInput
                  key={field.id}
                  index={index}
                  remove={remove}
                />
              ))}
            </FormProvider>

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                append({
                  id: null,
                  feature: "",
                  display_order: fields.length,
                })
              }
            >
              <Plus size={14} /> Feature
            </Button>
          </div>
        </div>
      </div>
    </FormWrapper>
  );
}
