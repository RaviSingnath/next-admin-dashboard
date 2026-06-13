"use client";

import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { appToast } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";

import { zProfileInfo, TProfileInfo } from "@/features/profile/profile.schema";
import { handleActionError } from "@/lib/helper/handle-action-error";
import { updateProfileInfoAction } from "../_lib/profile.actions";

type EditProfileFormProps = {
  closeModal: () => void;
};

export default function EditProfileForm({ closeModal }: EditProfileFormProps) {
  const router = useRouter();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TProfileInfo>({
    resolver: zodResolver(zProfileInfo),

    defaultValues: {
      full_name: user?.full_name || "",
      phone: user?.phone || "",
    },
  });

  const onSubmit = async (formData: TProfileInfo) => {
    try {
      const result = await updateProfileInfoAction(formData);

      if (!result.success) {
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            setError(field as keyof TProfileInfo, {
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
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      <div className="custom-scrollbar overflow-y-auto px-2 pb-3">
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
          <div className="col-span-2 lg:col-span-1">
            <Label>First Name</Label>
            <Input
              type="text"
              error={!!errors.full_name}
              hint={errors.full_name?.message}
              {...register("full_name")}
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
      </div>

      <div className="mt-6 flex items-center gap-3 px-2 lg:justify-end">
        <Button size="sm" variant="outline" onClick={closeModal}>
          Close
        </Button>

        <Button type="submit" size="sm" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
