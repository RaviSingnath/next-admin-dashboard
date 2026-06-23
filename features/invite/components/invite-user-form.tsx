"use client";

import { useEffect } from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";

import { UserRoleLabel } from "@/lib/rbac/roles";
import { getInviteUIRules } from "../invite.rbac";
import { zInvitePayload, type TInvitePayload } from "../invite.schema";
import { inviteUserAction } from "@/app/(protected)/invites/_lib/invite.actions";

import { AppSelectOption } from "@/lib/types/app-types";
import handleFormSubmit from "@/lib/helper/handle-form-submit";

import RoleSelect from "./role-select";
import CollegeSelect from "./college-select";
import DepartmentSelect from "./department-select";
import FormWrapper from "@/components/common/form-wrapper";

type InviteStudentFormProps = {
  closeModal: () => void;
  colleges?: AppSelectOption[];
};

export default function InviteUserForm({
  closeModal,
  colleges,
}: InviteStudentFormProps) {
  const { user } = useAuth();
  const router = useRouter();

  const inviteRules = user ? getInviteUIRules(user) : null;
  console.log(inviteRules);

  const roleOptions = inviteRules?.targetRoles.map((role) => ({
    value: role,
    label: UserRoleLabel[role],
  }));

  const departmentList = user?.departments?.map((department) => ({
    value: department.id,
    label: department.department_name,
  }));

  const form = useForm<TInvitePayload>({
    resolver: zodResolver(zInvitePayload),

    defaultValues: {
      full_name: "",
      invite_email: "",
      target_role: undefined,
      college_id: user?.college_id ?? "",
      department_id: user?.department_id ?? "",
    },
  });

  const {
    register,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (formData: TInvitePayload) => {
    await handleFormSubmit({
      action: () => inviteUserAction(formData),
      setError,
      router,
      successMessage: "Student invited successfully",
      onSuccess: () => {
        reset();
        closeModal();
      },
    });
  };

  useEffect(() => {
    if (inviteRules && inviteRules.targetRoles.length === 1) {
      form.setValue("target_role", inviteRules?.targetRoles[0]);
    }
  }, [inviteRules, form]);

  return (
    <FormWrapper
      form={form}
      closeModal={closeModal}
      onSubmit={onSubmit}
      isPending={isSubmitting}
      submitLabel="Invite"
      pendingLabel="Inviting..."
    >
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
        {inviteRules?.showRoleSelector && roleOptions && (
          <RoleSelect
            options={roleOptions ?? []}
            error={errors.target_role?.message}
          />
        )}
        {colleges && inviteRules?.college?.editable && (
          <CollegeSelect
            options={colleges ?? []}
            rules={inviteRules.college}
            error={errors.college_id?.message}
          />
        )}
        {departmentList && inviteRules?.department?.editable && (
          <DepartmentSelect
            options={departmentList ?? []}
            rules={inviteRules.department}
            error={errors.department_id?.message}
          />
        )}
      </div>
    </FormWrapper>
  );
}
