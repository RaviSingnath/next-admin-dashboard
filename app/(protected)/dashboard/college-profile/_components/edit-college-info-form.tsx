"use client";

import FormWrapper from "@/components/common/form-wrapper";
import handleFormSubmit from "@/lib/helper/handle-form-submit";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCollegeProfile } from "@/context/college-profile-context";

import { TCollegeInfo, zCollegeInfo } from "@/features/colleges/college.schema";
import { updateCollegeInfoAction } from "../_lib/college-profile.action";

type EditCollegeInfoFormProps = {
  closeModal: () => void;
};

export default function EditCollegeInfoForm({
  closeModal,
}: EditCollegeInfoFormProps) {
  const router = useRouter();
  const collegeProfile = useCollegeProfile();

  const form = useForm<TCollegeInfo>({
    resolver: zodResolver(zCollegeInfo),

    defaultValues: {
      college_name: collegeProfile?.college_name || "",
      phone: collegeProfile?.phone || "",
      official_email: collegeProfile?.official_email || "",
    },
  });
  const {
    register,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (formData: TCollegeInfo) => {
    await handleFormSubmit({
      action: () => updateCollegeInfoAction(formData),
      setError,
      router,
      successMessage: "College info updated successfully",
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
        <div className="col-span-2 lg:col-span-1">
          <Label>College Name</Label>
          <Input
            type="text"
            error={!!errors.college_name}
            hint={errors.college_name?.message}
            {...register("college_name")}
          />
        </div>

        <div className="col-span-2 lg:col-span-1">
          <Label>Official Email</Label>
          <Input
            type="text"
            error={!!errors.official_email}
            hint={errors.official_email?.message}
            {...register("official_email")}
          />
        </div>

        <div className="col-span-2 lg:col-span-1">
          <Label>Phone</Label>
          <Input
            type="text"
            error={!!errors.phone}
            hint={errors.phone?.message}
            {...register("phone")}
          />
        </div>
      </div>
    </FormWrapper>
  );
}
