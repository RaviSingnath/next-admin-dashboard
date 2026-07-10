import { UseFieldArrayRemove, useFormContext } from "react-hook-form";
import Input from "@/components/form/input/InputField";
import { TAdminPlan } from "../plan.schema";
import { Trash2 } from "lucide-react";

type PlanFeatureInputProps = {
  index: number;
  remove: UseFieldArrayRemove;
};

export default function PlanFeatureInput({
  index,
  remove,
}: PlanFeatureInputProps) {
  const { register } = useFormContext<TAdminPlan>();

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-5 items-center">
      <div className="lg:col-span-3">
        <Input {...register(`features.${index}.feature`)} />
      </div>

      <Input
        type="number"
        {...register(`features.${index}.display_order`, {
          valueAsNumber: true,
        })}
      />

      <button type="button" onClick={() => remove(index)}>
        <Trash2 size={16} />
      </button>
    </div>
  );
}
