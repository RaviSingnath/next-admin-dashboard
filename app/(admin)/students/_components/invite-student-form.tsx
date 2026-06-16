"use client";

import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { appToast } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";

import {
  zStudentInvite,
  type TStudentInvite,
} from "@/features/students/students.schema";
import { inviteStudentAction } from "../_lib/student.actions";
import {
  handleActionError,
  handleUnexpectedError,
} from "@/lib/helper/error-handler";
import { ERROR_CODES } from "@/lib/errors/error-codes";
import { handleFormSubmit } from "@/lib/helper/handle-form-submit";

type InviteStudentFormProps = {
  closeModal: () => void;
};

export default function InviteStudentForm({
  closeModal,
}: InviteStudentFormProps) {
  const { user } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TStudentInvite>({
    resolver: zodResolver(zStudentInvite),

    defaultValues: {
      invite_email: "",
    },
  });

  if (user?.college_id) register("college_id", { value: user?.college_id });
  if (user?.department_id)
    register("department_id", { value: user?.department_id });

  const onSubmit = async (formData: TStudentInvite) => {
    console.log(formData);
    await handleFormSubmit({
      action: () => inviteStudentAction(formData),
      setError,
      router,
      successMessage: "Student invited successfully",
      onSuccess: () => {
        reset();
        closeModal();
      },
    });
    // try {
    //   const result = await inviteStudentAction(formData);

    //   if (!result.success) {
    //     if (result.code === ERROR_CODES.VALIDATION_ERROR && result.errors) {
    //       Object.entries(result.errors).forEach(([field, messages]) => {
    //         setError(field as keyof TStudentInvite, {
    //           type: "server",
    //           message: (messages as string[])[0],
    //         });
    //       });
    //       return;
    //     }

    //     handleActionError(result, router);

    //     return;
    //   }

    //   appToast.success("Student invited successfully");

    //   reset();
    //   closeModal();
    // } catch (error) {
    //   console.error(error);
    //   handleUnexpectedError(error);
    // }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      <div className="custom-scrollbar overflow-y-auto px-2 pb-3">
        <div className="mt-7">
          <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
            Student Information
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
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3 px-2 lg:justify-end">
        <Button size="sm" variant="outline" onClick={closeModal}>
          Close
        </Button>

        <Button type="submit" size="sm" disabled={isSubmitting}>
          {isSubmitting ? "Inviting..." : "Invite Student"}
        </Button>
      </div>
    </form>
  );
}
