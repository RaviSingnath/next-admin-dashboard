"use client";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  zCollegeAdmin,
  type TCollegeAdmin,
} from "@/lib/validations/admin/college-schema";

type InviteCollegeAdminFormProps = {
  closeModal: () => void;
};

export default function InviteCollegeAdminForm({
  closeModal,
}: InviteCollegeAdminFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TCollegeAdmin>({
    resolver: zodResolver(zCollegeAdmin),

    defaultValues: {
      invite_email: "",
    },
  });

  const onSubmit = async (formData: TCollegeAdmin) => {
    try {
      const response = await fetch("/api/admin/create-college", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          Object.entries(data.errors).forEach(([field, messages]) => {
            setError(field as keyof TCollegeAdmin, {
              type: "server",
              message: (messages as string[])[0],
            });
          });
        }

        return;
      }

      reset();
      closeModal();
      console.log("Success", data);
    } catch (error) {
      console.error(error);
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
          {isSubmitting ? "Inviting..." : "Invite College Admin"}
        </Button>
      </div>
    </form>
  );
}
