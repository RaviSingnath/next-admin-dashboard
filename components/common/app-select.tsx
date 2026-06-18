"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SelectOption = {
  label: string;
  value: string;
};

type AppSelectProps = {
  options: SelectOption[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
} & React.ComponentProps<typeof Select>;

export function AppSelect({
  options,
  placeholder = "Select option",
  value,
  onChange,
  ...props
}: AppSelectProps) {
  return (
    <Select value={value} onValueChange={onChange} {...props}>
      <SelectTrigger className="w-full px-4 py-2.5 h-11!">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent className="z-[999]" position="popper">
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
