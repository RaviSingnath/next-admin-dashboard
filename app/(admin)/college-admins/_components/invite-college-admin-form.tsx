"use client";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import SelectInputs from "@/components/ui/form/form-elements/SelectInputs";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { appToast } from "@/lib/toast";
import { useRouter } from "next/navigation";

import {
  zCollegeAdminInvite,
  type TCollegeAdminInvite,
} from "@/features/college-admins/college-admin.schema";
import { InviteCollegeAdminAction } from "../_lib/college-admin.actions";
import { handleActionError } from "@/lib/helper/handle-action-error";
import { ERROR_CODES } from "@/lib/errors/error-codes";
import { handleUnexpectedError } from "@/lib/helper/handle-unexpected-error";

type InviteCollegeAdminFormProps = {
  closeModal: () => void;
  options: { value: string; label: string }[];
};

export default function InviteCollegeAdminForm({
  options,
  closeModal,
}: InviteCollegeAdminFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TCollegeAdminInvite>({
    resolver: zodResolver(zCollegeAdminInvite),

    defaultValues: {
      invite_email: "",
    },
  });

  const onSubmit = async (formData: TCollegeAdminInvite) => {
    try {
      const result = await InviteCollegeAdminAction(formData);

      if (!result.success) {
        if (result.code === ERROR_CODES.VALIDATION_ERROR && result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            setError(field as keyof TCollegeAdminInvite, {
              type: "server",
              message: (messages as string[])[0],
            });
          });

          return;
        }

        handleActionError(result, router);

        return;
      }

      appToast.success("College admin invited successfully");

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
            College Admin Information
          </h5>

          <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
            <div className="col-span-2">
              <Label>Full Name</Label>

              <Input
                type="text"
                error={!!errors.full_name}
                hint={errors.full_name?.message}
                {...register("full_name")}
              />
            </div>
            <div className="col-span-2">
              <Label>Email Address</Label>

              <Input
                type="email"
                error={!!errors.invite_email}
                hint={errors.invite_email?.message}
                {...register("invite_email")}
              />
            </div>
            <div className="col-span-2">
              <SelectInputs
                label="Select College"
                placeholder="select college"
                options={options}
                {...register("college_id")}
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
          {isSubmitting ? "Inviting..." : "Invite College Admin"}
        </Button>
      </div>
    </form>
  );
}
