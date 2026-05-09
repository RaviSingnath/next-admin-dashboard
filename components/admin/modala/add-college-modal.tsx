"use client";

import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { zCollege, type TCollege } from "@/lib/zod/admin/college-schema";

type AddCollegeModalProps = {
  isOpen: boolean;
  closeModal: () => void;
};

export function AddCollegeModal({ isOpen, closeModal }: AddCollegeModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TCollege>({
    resolver: zodResolver(zCollege),

    defaultValues: {
      college_name: "",
      college_email: "",
      phone: "",
      country: "",
      state: "",
      city: "",
      postal_code: "",
    },
  });

  const onSubmit = async (data: TCollege) => {
    try {
      console.log("Validated Data:", data);

      // TODO:
      // insert into supabase

      reset();
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      className="max-w-[700px] m-4 text-start"
    >
      <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Add College
          </h4>

          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Enter the details below to register a new college.
          </p>
        </div>

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
                    error={!!errors.college_email}
                    hint={errors.college_email?.message}
                    {...register("college_email")}
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
      </div>
    </Modal>
  );
}
