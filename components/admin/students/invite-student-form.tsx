"use client";

import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { appToast } from "@/lib/toast";
import { useRouter } from "next/navigation";
import useUser from "@/hooks/useUser";

import {
  zStudentInvite,
  type TStudentInvite,
} from "@/lib/validations/admin/college-schema";

type InviteStudentFormProps = {
  closeModal: () => void;
};

export default function InviteStudentForm({
  closeModal,
}: InviteStudentFormProps) {
  const { user } = useUser();

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
    try {
      const response = await fetch("/api/admin/student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        if (data.errors) {
          Object.entries(data.errors).forEach(([field, messages]) => {
            setError(field as keyof TStudentInvite, {
              type: "server",
              message: (messages as string[])[0],
            });
          });
          return;
        }

        if (!data.success) {
          switch (data.code) {
            case "INVITATION_EXISTS":
              appToast.error("Invitation already sent");
              return;

            case "FORBIDDEN":
              appToast.error("You do not have permission");
              return;

            case "UNAUTHORIZED":
              router.push("/login");
              return;

            default:
              appToast.error(data.message || "Something went wrong");
              return;
          }
        }
      }

      reset();
      closeModal();
    } catch (error) {
      console.error(error);
    }
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
