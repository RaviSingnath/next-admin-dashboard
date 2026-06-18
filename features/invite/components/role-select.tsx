"use client";

import { Controller, useFormContext } from "react-hook-form";

import Label from "@/components/form/Label";
import { AppSelect } from "@/components/common/app-select";

import type { AppSelectOption } from "@/lib/types/app-types";
import type { TInvitePayload } from "../invite.schema";

type DepartmentSelectProps = {
  options: AppSelectOption[];
  error?: string;
};

export default function RoleSelect({ options, error }: DepartmentSelectProps) {
  const { control } = useFormContext<TInvitePayload>();

  return (
    <div className="col-span-2">
      <Label>Assing Role</Label>
      <Controller
        control={control}
        name="target_role"
        render={({ field }) => (
          <AppSelect
            options={options}
            placeholder="Select role"
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
