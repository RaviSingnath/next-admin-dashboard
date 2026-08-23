import {
  ClipboardCheck,
  IndianRupee,
  UserPlus,
  TrendingUp,
} from "lucide-react";
import AppCard from "@/components/ui/app/app-card";

const activity = [
  {
    text: "12 admission requests approved this week",
    time: "2 hr ago",
    icon: ClipboardCheck,
  },
  {
    text: "Fee reminder sent to 340 students with pending dues",
    time: "5 hr ago",
    icon: IndianRupee,
  },
  {
    text: "Meera Kapoor added as supervisor, Physics dept",
    time: "Yesterday",
    icon: UserPlus,
  },
  {
    text: "Plan upgraded from Starter to Growth",
    time: "2 days ago",
    icon: TrendingUp,
  },
];

export default function RecentActivity() {
  return (
    <AppCard >
      <h2 className="font-display mb-4 text-base font-semibold">
        Recent activity
      </h2>
      <div className="space-y-4">
        {activity.map((a, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F6F7FB]">
              <a.icon size={14} className="text-[#5B6478]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm">{a.text}</div>
              <div className="mt-0.5 text-xs text-[#9BA1B0]">{a.time}</div>
            </div>
          </div>
        ))}
      </div>
    </AppCard>
  );
}
