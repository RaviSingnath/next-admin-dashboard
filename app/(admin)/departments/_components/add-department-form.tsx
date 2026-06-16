"use client";

import Button from "@/components/ui/button/Button";
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
import { handleActionError } from "@/lib/helper/handle-action-error";
import { handleUnexpectedError } from "@/lib/helper/handle-unexpected-error";
import { ERROR_CODES } from "@/lib/errors/error-codes";

type AddDepartmentFormProps = {
  closeModal: () => void;
};

export default function AddDepartmentForm({
  closeModal,
}: AddDepartmentFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TAddDepartment>({
    resolver: zodResolver(zAddDepartment),

    defaultValues: {
      department_name: "",
    },
  });

  const onSubmit = async (formData: TAddDepartment) => {
    try {
      const result = await createDepartmentAction(formData);

      if (!result.success) {
        if (result.code === ERROR_CODES.VALIDATION_ERROR && result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            setError(field as keyof TAddDepartment, {
              type: "server",
              message: (messages as string[])[0],
            });
          });

          return;
        }

        handleActionError(result, router);

        return;
      }

      appToast.success("Department added successfully");

      reset();
      closeModal();
    } catch (error) {
      console.error(error);
      handleUnexpectedError(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      <div className="custom-scrollbar overflow-y-auto px-2 pb-3">
        <div className="mt-7">
          <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
            Department Information
          </h5>

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
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3 px-2 lg:justify-end">
        <Button size="sm" variant="outline" onClick={closeModal}>
          Close
        </Button>

        <Button type="submit" size="sm" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Department"}
        </Button>
      </div>
    </form>
  );
}
