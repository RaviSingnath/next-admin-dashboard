"use client";

import { Controller, useFormContext } from "react-hook-form";

import Label from "@/components/form/Label";
import { AppSelect } from "@/components/common/app-select";

import type { AppSelectOption } from "@/lib/types/app-types";
import type { TInvitePayload } from "../invite.schema";

type DepartmentSelectProps = {
  options: AppSelectOption[];
  rules: {
    visible: boolean;
    editable: boolean;
  };
  error?: string;
};

export default function DepartmentSelect({
  options,
  rules: { visible = true, editable = true },
  error,
}: DepartmentSelectProps) {
  const { control } = useFormContext<TInvitePayload>();

  if (!visible) return null;

  return (
    <div className="col-span-2">
      <Label>Department</Label>

      <Controller
        control={control}
        name="department_id"
        render={({ field }) => (
          <AppSelect
            options={options}
            placeholder="Select department"
            value={field.value}
            onChange={field.onChange}
            disabled={!editable}
          />
        )}
      />

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
