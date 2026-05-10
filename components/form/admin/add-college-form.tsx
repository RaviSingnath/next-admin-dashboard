"use client";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  zCollege,
  type TCollege,
} from "@/lib/validations/admin/college-schema";

type AddCollegeFormProps = {
  closeModal: () => void;
};

export default function AddCollegeForm({ closeModal }: AddCollegeFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
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
            setError(field as keyof TCollege, {
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

        <Button type="submit" size="sm" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add College"}
        </Button>
      </div>
    </form>
  );
}
