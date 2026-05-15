"use client";
import React, { useState } from "react";
import MultiSelect from "../MultiSelect";

type MultiSelectInputsProps = {
  label: string;
  onSelect: (values: string[]) => void;
  placeholder: string;
  multiOptions: { value: string; text: string; selected: boolean }[];
};

export default function MultiSelectInputs({
  label,
  multiOptions,
  onSelect,
  placeholder,
}: MultiSelectInputsProps) {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  return (
    <div className="relative">
      <MultiSelect
        label={label}
        options={multiOptions}
        placeholder={placeholder}
        defaultSelected={["1", "3"]}
        onChange={(values) => {
          setSelectedValues(values);
          onSelect(values);
        }}
      />
      <p className="sr-only">Selected Values: {selectedValues.join(", ")}</p>
    </div>
  );
}
