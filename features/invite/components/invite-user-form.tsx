"use client";

import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";

import {
  zStudentInvite,
  type TStudentInvite,
} from "@/features/students/students.schema";
import { inviteStudentAction } from "@/app/(admin)/students/_lib/student.actions";

import { handleFormSubmit } from "@/lib/helper/handle-form-submit";
import { AppSelect } from "@/components/common/app-select";
import { AppSelectOption } from "@/lib/types/app-types";

type InviteStudentFormProps = {
  closeModal: () => void;
  colleges: AppSelectOption[];
};

export default function InviteUserForm({
  closeModal,
  colleges,
}: InviteStudentFormProps) {
  const { user } = useAuth();
  const router = useRouter();
  console.log(user, colleges);

  const departmentList = user?.departments?.map((department) => ({
    value: department.id,
    label: department.department_name,
  }));

  const form = useForm<TStudentInvite>({
    resolver: zodResolver(zStudentInvite),

    defaultValues: {
      full_name: "",
      invite_email: "",
      college_id: user?.college_id ?? "",
      department_id: user?.department_id ?? "",
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = form;

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
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      <div className="custom-scrollbar overflow-visible px-2 pb-3">
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
            <div className="col-span-2">
              <Label>College</Label>
              <Controller
                control={form.control}
                name="college_id"
                render={({ field }) => (
                  <AppSelect
                    options={colleges}
                    placeholder="Select college"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.college_id && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.college_id.message}
                </p>
              )}
            </div>
            {departmentList && (
              <div className="col-span-2">
                <Label>Department</Label>
                <Controller
                  control={form.control}
                  name="department_id"
                  render={({ field }) => (
                    <AppSelect
                      options={departmentList}
                      placeholder="Select department"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.department_id && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.department_id.message}
                  </p>
                )}
              </div>
            )}
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
