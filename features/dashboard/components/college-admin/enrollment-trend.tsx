"use client";

import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";
import AppCard from "@/components/ui/app/app-card";

const enrollment = [
  { month: "Jan", students: 2510 },
  { month: "Feb", students: 2562 },
  { month: "Mar", students: 2601 },
  { month: "Apr", students: 2645 },
  { month: "May", students: 2678 },
  { month: "Jun", students: 2712 },
  { month: "Jul", students: 2789 },
  { month: "Aug", students: 2847 },
];

export default function EnrollmentTrend() {
  return (
    <AppCard className="lg:col-span-2">
      <div className="mb-1 flex items-center justify-between">
        <h2 className="font-display text-base font-semibold">
          Enrollment trend
        </h2>
        <span className="flex items-center gap-1 text-xs font-medium text-[#12876B]">
          <TrendingUp size={13} /> +13.4% since Jan
        </span>
      </div>
      <p className="mb-2 text-xs text-[#9BA1B0]">
        Total students enrolled, last 8 months
      </p>
      <div className="-ml-2 h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={enrollment}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid vertical={false} stroke="#F1F2F7" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: "#9BA1B0" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #E7E9F2",
                fontSize: 12,
              }}
              labelStyle={{ color: "#0F1B2D", fontWeight: 500 }}
            />
            <Area
              type="monotone"
              dataKey="students"
              stroke="#2F5FA8"
              fill="#2F5FA8"
              fillOpacity={0.12}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </AppCard>
  );
}
