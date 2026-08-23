import { ArrowUpRight } from "lucide-react";
import AppCard from "@/components/ui/app/app-card";

export default function PendingApprovals() {
  const approvals = [
    {
      title: "Meera Kapoor",
      detail: "Supervisor invite · Physics dept",
      tag: "Invite",
      tagColor: "bg-[#EAF0FA] text-[#2A5590]",
    },
    {
      title: "Devansh Rao",
      detail: "Admission request · verification pending",
      tag: "Admission",
      tagColor: "bg-[#E9F6F1] text-[#0F6E56]",
    },
    {
      title: "Ananya Bose",
      detail: "Fee waiver request · ₹12,000",
      tag: "Finance",
      tagColor: "bg-[#FBF1E1] text-[#A66A0D]",
    },
    {
      title: "Ishaan Verma",
      detail: "Department transfer · CS → Electronics",
      tag: "Transfer",
      tagColor: "bg-[#FBEAE6] text-[#B84A38]",
    },
  ];

  return (
    <AppCard >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-base font-semibold">
          Pending approvals
        </h2>
        <button className="flex items-center gap-1 text-sm font-medium text-[#2F5FA8]">
          Review all <ArrowUpRight size={14} />
        </button>
      </div>
      <div className="space-y-1">
        {approvals.map((a) => (
          <div
            key={a.title}
            className="flex items-center gap-3 border-b border-[#F1F2F7] py-2.5 last:border-0"
          >
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">{a.title}</div>
              <div className="truncate text-xs text-[#5B6478]">{a.detail}</div>
            </div>
            <span
              className={`shrink-0 rounded-md px-2 py-1 text-[11px] font-medium ${a.tagColor}`}
            >
              {a.tag}
            </span>
          </div>
        ))}
      </div>
    </AppCard>
  );
}
