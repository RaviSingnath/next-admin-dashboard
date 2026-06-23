"use client";

import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { appToast } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { createDepartmentAction } from "../_lib/department.actions";

import {
  zAddDepartment,
  type TAddDepartment,
} from "@/features/departments/department.schema";
import {
  handleActionError,
  handleUnexpectedError,
} from "@/lib/helper/error-handler";
import { ERROR_CODES } from "@/lib/errors/error-codes";
import FormWrapper from "@/components/common/form-wrapper";
import handleFormSubmit from "@/lib/helper/handle-form-submit";

type AddDepartmentFormProps = {
  closeModal: () => void;
};

export default function AddDepartmentForm({
  closeModal,
}: AddDepartmentFormProps) {
  const router = useRouter();

  const form = useForm<TAddDepartment>({
    resolver: zodResolver(zAddDepartment),

    defaultValues: {
      department_name: "",
    },
  });

  const {
    register,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (formData: TAddDepartment) => {
    await handleFormSubmit({
      action: () => createDepartmentAction(formData),
      setError,
      router,
      successMessage: "Department added successfully",
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
      submitLabel="Add"
      pendingLabel="Adding..."
    >
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
        <div className="col-span-2">
          <Label>Department Name</Label>

          <Input
            type="text"
            error={!!errors.department_name}
            hint={errors.department_name?.message}
            {...register("department_name")}
          />
        </div>
      </div>
    </FormWrapper>
  );
}
