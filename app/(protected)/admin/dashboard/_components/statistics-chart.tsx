"use client";
import { useEffect, useRef } from "react";
// import flatpickr from "flatpickr";
import ChartTab from "@/components/common/chart-tab";
// import { CalendarSearch } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartData = [
  { month: "January", sales: 186, revenue: 80 },
  { month: "February", sales: 305, revenue: 200 },
  { month: "March", sales: 237, revenue: 120 },
  { month: "April", sales: 190, revenue: 77 },
  { month: "May", sales: 209, revenue: 130 },
  { month: "June", sales: 214, revenue: 140 },
  { month: "July", sales: 253, revenue: 120 },
  { month: "August", sales: 114, revenue: 100 },
  { month: "September", sales: 314, revenue: 240 },
  { month: "October", sales: 140, revenue: 90 },
  { month: "November", sales: 165, revenue: 135 },
  { month: "December", sales: 190, revenue: 155 },
];

const chartConfig = {
  sales: {
    label: "Sales",
    color: "var(--color-brand-500)",
  },
  revenue: {
    label: "Revenue",
    color: "var(--color-brand-200)",
  },
} satisfies ChartConfig;

export default function StatisticsChart() {
  // const datePickerRef = useRef<HTMLInputElement>(null);

  // useEffect(() => {
  //   if (!datePickerRef.current) return;

  //   const today = new Date();
  //   const sevenDaysAgo = new Date();
  //   sevenDaysAgo.setDate(today.getDate() - 6);

  //   const fp = flatpickr(datePickerRef.current, {
  //     mode: "range",
  //     static: true,
  //     monthSelectorType: "static",
  //     dateFormat: "M d",
  //     defaultDate: [sevenDaysAgo, today],
  //     clickOpens: true,
  //     prevArrow:
  //       '<svg class="stroke-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.5 15L7.5 10L12.5 5" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  //     nextArrow:
  //       '<svg class="stroke-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 15L12.5 10L7.5 5" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  //   });

  //   return () => {
  //     if (!Array.isArray(fp)) {
  //       fp.destroy();
  //     }
  //   };
  // }, []);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-5 sm:px-6 sm:pt-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Statistics
          </h3>
          <p className="text-theme-sm mt-1 text-gray-500 dark:text-gray-400">
            Target you&apos;ve set for each month
          </p>
        </div>
        <div className="flex items-center gap-3 sm:justify-end">
          <ChartTab />
          {/* <div className="relative inline-flex items-center">
            <CalendarSearch className="pointer-events-none absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-gray-500 lg:top-1/2 lg:left-3 lg:translate-x-0 lg:-translate-y-1/2 dark:text-gray-400" />
            <input
              ref={datePickerRef}
              className="h-10 w-10 cursor-pointer rounded-lg border border-gray-200 bg-white text-sm font-medium text-transparent outline-none lg:h-auto lg:w-40 lg:py-2 lg:pr-3 lg:pl-10 lg:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:lg:text-gray-300"
              placeholder="Select date range"
            />
          </div> */}
        </div>
      </div>

      <div className="custom-scrollbar max-w-full overflow-x-auto">
        <div className="min-w-[1000px] xl:min-w-full">
          <ChartContainer config={chartConfig} className="h-[310px] w-full">
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
                top: 20,
                bottom:10
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis
                tickCount={8}
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Line
                dataKey="sales"
                type="monotone"
                stroke="var(--color-sales)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey="revenue"
                type="monotone"
                stroke="var(--color-revenue)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}
