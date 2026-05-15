"use client";

import Label from "../Label";
import Select from "../Select";
import { ChevronDownIcon } from "lucide-react";

type SelectInputsProps = {
  label: string;
  onSelect?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder: string;
  options: { value: string; label: string }[];
};

export default function SelectInputs({
  label,
  options,
  onSelect,
  placeholder,
  ...props
}: SelectInputsProps) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="relative">
        <Select
          options={options}
          placeholder={placeholder}
          onChange={onSelect}
          className="dark:bg-dark-900"
          {...props}
        />
        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
          <ChevronDownIcon />
        </span>
      </div>
    </div>
  );
}
