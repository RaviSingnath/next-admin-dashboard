"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import { zCollege, TCollege } from "@/features/colleges/college.schema";
import { createCollegeAction } from "../_lib/college.actions";
import { appToast } from "@/lib/toast";

type AddCollegeFormProps = {
  closeModal: () => void;
};

export default function AddCollegeForm({ closeModal }: AddCollegeFormProps) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<TCollege>({
    resolver: zodResolver(zCollege),

    defaultValues: {
      college_name: "",
      official_email: "",
      phone: "",
      country: "",
      state: "",
      city: "",
      postal_code: "",
    },
  });

  const onSubmit = async (formData: TCollege) => {
    startTransition(async () => {
      try {
        const result = await createCollegeAction(formData);

        if (!result.success) {
          if (result.errors) {
            Object.entries(result.errors).forEach(([field, messages]) => {
              setError(field as keyof TCollege, {
                type: "server",
                message: (messages as string[])[0],
              });
            });
          }
          return;
        }

        appToast.success("College created successfully");

        reset();
        closeModal();
      } catch (error) {
        console.error(error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
        <div className="mt-7">
          <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
            College Information
          </h5>

          <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
            <div className="col-span-2">
              <Label>College Name</Label>

              <Input
                type="text"
                error={!!errors.college_name}
                hint={errors.college_name?.message}
                {...register("college_name")}
              />
            </div>

            <div className="col-span-2 lg:col-span-1">
              <Label>Email Address</Label>

              <Input
                type="email"
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

            <div className="col-span-2 lg:col-span-1">
              <Label>Country</Label>

              <Input
                type="text"
                error={!!errors.country}
                hint={errors.country?.message}
                {...register("country")}
              />
            </div>

            <div className="col-span-2 lg:col-span-1">
              <Label>State</Label>

              <Input
                type="text"
                error={!!errors.state}
                hint={errors.state?.message}
                {...register("state")}
              />
            </div>

            <div className="col-span-2 lg:col-span-1">
              <Label>City</Label>

              <Input
                type="text"
                error={!!errors.city}
                hint={errors.city?.message}
                {...register("city")}
              />
            </div>

            <div className="col-span-2 lg:col-span-1">
              <Label>Postal Code</Label>

              <Input
                type="text"
                error={!!errors.postal_code}
                hint={errors.postal_code?.message}
                {...register("postal_code")}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3 px-2 lg:justify-end">
        <Button size="sm" variant="outline" onClick={closeModal}>
          Close
        </Button>

        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? "Adding..." : "Add College"}
        </Button>
      </div>
    </form>
  );
}
