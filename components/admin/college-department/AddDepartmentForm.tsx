"use client";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { appToast } from "@/lib/toast";
import { useRouter } from "next/navigation";

import {
  zAddDepartment,
  type TAddDepartment,
} from "@/lib/validations/admin/college-schema";

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
      const response = await fetch("/api/admin/department", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log(data, response);

      if (!response.ok || !data.success) {
        if (data.errors) {
          Object.entries(data.errors).forEach(([field, messages]) => {
            setError(field as keyof TAddDepartment, {
              type: "server",
              message: (messages as string[])[0],
            });
          });
          return;
        }

        if (!data.success) {
          switch (data.code) {
            case "DEPARTMENT_EXISTS":
              appToast.error("Department already exist");
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
