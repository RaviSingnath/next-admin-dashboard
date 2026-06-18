"use client";

import {
  FormProvider,
  type UseFormReturn,
  type FieldValues,
} from "react-hook-form";

import Button from "@/components/ui/button/Button";

type FormWrapperProps<T extends FieldValues> = {
  form: UseFormReturn<T>;

  onSubmit: (data: T) => void | Promise<void>;

  children: React.ReactNode;

  closeModal: () => void;

  isPending?: boolean;

  submitLabel?: string;

  pendingLabel?: string;
};

export default function FormWrapper<T extends FieldValues>({
  form,
  onSubmit,
  children,
  closeModal,
  isPending = false,
  submitLabel = "Save",
  pendingLabel = "Saving...",
}: FormWrapperProps<T>) {
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
        <div className="custom-scrollbar max-h-[450px] overflow-y-auto px-2 pb-3">
          <div className="mt-7">{children}</div>
        </div>

        <div className="mt-6 flex items-center gap-3 px-2 lg:justify-end">
          <Button
            size="sm"
            variant="outline"
            type="button"
            onClick={closeModal}
          >
            Close
          </Button>

          <Button type="submit" size="sm" disabled={isPending}>
            {isPending ? pendingLabel : submitLabel}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
