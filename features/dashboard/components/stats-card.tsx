import { type LucideIcon } from "lucide-react";
import AppCard from "@/components/ui/app/app-card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  stats: {
    label: string;
    value: string | number;
    icon: LucideIcon;
    tint: string;
    ring: string;
    bar: string;
    note: string;
  };
}

export default function StatsCard({ stats }: StatsCardProps) {
  const { label, value, icon: Icon, tint, ring, bar, note } = stats;

  return (
    <AppCard className="relative overflow-hidden border border-l-0">
      <div className={`absolute top-0 left-0 h-full w-1 ${bar}`} />
      <div
        className={cn(
          `mb-3 flex h-9 w-9 items-center justify-center rounded-lg dark:bg-white/5`,
          tint,
        )}
      >
        <Icon size={17} className={ring} />
      </div>
      <div className="font-display text-2xl font-bold">{value}</div>
      <div className="mt-0.5 text-sm text-[#5B6478]">{label}</div>
      <div className="mt-2 text-xs text-[#9BA1B0]">{note}</div>
    </AppCard>
  );
}
