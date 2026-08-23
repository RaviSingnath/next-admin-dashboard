import { CreditCard } from "lucide-react";
import AppCard from "@/components/ui/app/app-card";
import Button from "@/components/ui/button/Button";

export default function YourPlan() {
  return (
    <AppCard>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-base font-semibold">Your plan</h2>
        <span className="rounded-md bg-[#EAF0FA] px-2 py-1 text-[11px] font-medium text-[#2A5590]">
          Growth
        </span>
      </div>
      <div className="font-display text-2xl font-bold">
        348{" "}
        <span className="text-sm font-normal text-[#9BA1B0]">
          / 500 students
        </span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#F1F2F7]">
        <div
          className="h-full rounded-full bg-[#2F5FA8]"
          style={{ width: "70%" }}
        />
      </div>
      <div className="mt-2 text-xs text-[#9BA1B0]">Renews 12 Sep 2026</div>
      <Button
        className="mt-auto flex items-center justify-center gap-2"
        size="sm"
        variant="outline"
      >
        <CreditCard size={15} /> Manage billing
      </Button>
    </AppCard>
  );
}
