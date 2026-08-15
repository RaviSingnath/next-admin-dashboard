"use client";
import ComponentCard from "@/components/common/cmponent-card";
import InviteUserButton from "@/features/invite/components/invite-user-button";
import type { AuthUser } from "@/lib/auth/types";
import getGreeting from "@/lib/helper/user-greeting";
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  UserCheck,
  Clock,
  AlertTriangle,
  MessageSquare,
  CalendarClock,
  ArrowUpRight,
} from "lucide-react";
import { type SupervisorDashboardData } from "../services/supervisor-dashboard.service";

type SupervisorDashboardProps = {
  user: AuthUser;
  data: SupervisorDashboardData;
};

const chartData = [
  { name: "attendance", value: 82, fill: "var(--color-brand-500)" },
];

const attention = [
  {
    name: "Aarav Mehta",
    id: "HU-2213",
    reason: "Attendance below 65%",
    tag: "Attendance",
    tagColor: "bg-[#FBEAE6] text-[#B84A38]",
    init: "AM",
  },
  {
    name: "Priya Nair",
    id: "HU-2244",
    reason: "Fee due for 9 days",
    tag: "Finance",
    tagColor: "bg-[#FBF1E1] text-[#A66A0D]",
    init: "PN",
  },
  {
    name: "Rohan Das",
    id: "HU-2078",
    reason: "2 missed submissions",
    tag: "Academic",
    tagColor: "bg-[#EAF0FA] text-[#2A5590]",
    init: "RD",
  },
  {
    name: "Sara Iyer",
    id: "HU-2301",
    reason: "Attendance below 65%",
    tag: "Attendance",
    tagColor: "bg-[#FBEAE6] text-[#B84A38]",
    init: "SI",
  },
  {
    name: "Kabir Shah",
    id: "HU-2159",
    reason: "Fee overdue, 14 days",
    tag: "Finance",
    tagColor: "bg-[#FBF1E1] text-[#A66A0D]",
    init: "KS",
  },
];

const activity = [
  {
    text: "Priya Nair submitted a leave request",
    time: "12 min ago",
    icon: CalendarClock,
  },
  {
    text: "You approved Rohan Das's assignment extension",
    time: "1 hr ago",
    icon: UserCheck,
  },
  {
    text: "Sara Iyer's guardian sent a message",
    time: "3 hr ago",
    icon: MessageSquare,
  },
  { text: "Attendance synced for Section B", time: "Yesterday", icon: Clock },
];

export default function SupervisorDashboard({
  user,
  data,
}: SupervisorDashboardProps) {
  const title = `${getGreeting()}, ${user.full_name}`;

  const stats = [
    {
      label: "My students",
      value: data.activeStudentsCount,
      icon: Users,
      tint: "bg-[#EAF0FA]",
      ring: "text-[#2F5FA8]",
      bar: "bg-[#2F5FA8]",
      note: "1 sections",
    },
    {
      label: "Active",
      value: data.activeStudentsCount,
      icon: UserCheck,
      tint: "bg-[#E9F6F1]",
      ring: "text-[#12876B]",
      bar: "bg-[#12876B]",
      note: `${data.allStudentsCount > 0 ? (data.activeStudentsCount / data.allStudentsCount) * 100 : 0}% of total`,
    },
    {
      label: "Pending",
      value: data.pendingStudentsCount,
      icon: Clock,
      tint: "bg-[#FBF1E1]",
      ring: "text-[#C17D11]",
      bar: "bg-[#C17D11]",
      note: "awaiting review",
    },
    {
      label: "Needs attention",
      value: 5,
      icon: AlertTriangle,
      tint: "bg-[#FBEAE6]",
      ring: "text-[#D65A46]",
      bar: "bg-[#D65A46]",
      note: "2 new today",
    },
  ];

  return (
    <ComponentCard
      title={title}
      titleClass="text-[26px] font-semibold"
      desc="Here's what's happening with your students"
      ActionButton={<InviteUserButton />}
    >
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-4"
          >
            <div className={`absolute top-0 left-0 h-full w-1 ${s.bar}`} />
            <div className="mb-3 flex items-center justify-between">
              <div
                className={`h-9 w-9 rounded-lg ${s.tint} flex items-center justify-center`}
              >
                <s.icon size={17} className={s.ring} />
              </div>
            </div>
            <div className="font-display text-2xl font-bold">{s.value}</div>
            <div className="mt-0.5 text-sm text-gray-500">{s.label}</div>
            <div className="mt-2 text-xs text-gray-400">{s.note}</div>
          </div>
        ))}
      </div>

      {/* Attention + attendance */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold">
              Students needing attention
            </h2>
            <button className="text-brand-500 flex items-center gap-1 text-sm font-medium">
              View all <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="space-y-1">
            {attention.map((a) => (
              <div
                key={a.id}
                className="flex items-center gap-3 border-b border-gray-100 py-2.5 last:border-0"
              >
                <div className="bg-gray-75 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-gray-500">
                  {a.init}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">
                    {a.name}{" "}
                    <span className="font-normal text-gray-400">· {a.id}</span>
                  </div>
                  <div className="truncate text-xs text-gray-500">
                    {a.reason}
                  </div>
                </div>
                <span
                  className={`shrink-0 rounded-md px-2 py-1 text-[11px] font-medium ${a.tagColor}`}
                >
                  {a.tag}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="font-display mb-2 text-base font-semibold">
            Weekly attendance
          </h2>
          <div className="relative flex min-h-[160px] flex-1 items-center justify-center">
            <ResponsiveContainer width="100%" height={160}>
              <RadialBarChart
                cx="50%"
                cy="100%"
                innerRadius="120%"
                outerRadius="180%"
                barSize={14}
                startAngle={180}
                endAngle={0}
                data={chartData}
              >
                <PolarAngleAxis
                  type="number"
                  domain={[0, 100]}
                  angleAxisId={0}
                  tick={false}
                />
                <RadialBar
                  background={{ fill: "var(--color-gray-200)" }}
                  dataKey="value"
                  cornerRadius={8}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute bottom-0 text-center">
              <div className="font-display text-2xl font-bold">82%</div>
              <div className="text-xs text-gray-400">avg. this week</div>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500">
            <span>Last week</span>
            <span className="font-medium text-[#12876B]">↑ 4% · 78%</span>
          </div>
        </div>
      </div>

      {/* Activity */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="font-display mb-4 text-base font-semibold">
          Recent activity
        </h2>
        <div className="space-y-4">
          {activity.map((a, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="bg-gray-75 mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                <a.icon size={14} className="text-gray-500" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm">{a.text}</div>
                <div className="mt-0.5 text-xs text-gray-400">{a.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ComponentCard>
  );
}
