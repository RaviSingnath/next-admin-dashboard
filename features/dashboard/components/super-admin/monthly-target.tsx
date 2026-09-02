"use client";

import { useState } from "react";
import { Ellipsis, ArrowUp, ArrowDown } from "lucide-react";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartData = { month: "january", revenue: 570, target: 755 };
const remaining = Math.max(chartData.target - chartData.revenue, 0);
// Recharts stacks bars additively, so the chart's full sweep needs to equal
// the target — the second bar is the *remainder* (target - revenue), not
// the target itself, otherwise the visual split doesn't match the real
// revenue/target percentage.
const chartDisplayData = [{ ...chartData, remaining }];

const chartConfig = {
  remaining: {
    label: "Remaining",
  },
  revenue: {
    label: "Revenue",
  },
} satisfies ChartConfig;

export default function MonthlyTarget() {
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const percentage = ((chartData.revenue / chartData.target) * 100).toFixed(2);

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="shadow-default rounded-2xl bg-white px-5 pt-5 pb-11 sm:px-6 sm:pt-6 dark:bg-gray-900">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Monthly Target
            </h3>
            <p className="text-theme-sm mt-1 font-normal text-gray-500 dark:text-gray-400">
              Target you’ve set for each month
            </p>
          </div>
          <div className="relative inline-block">
            <button onClick={toggleDropdown} className="dropdown-toggle">
              <Ellipsis className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
            </button>
            <Dropdown
              isOpen={isOpen}
              onClose={closeDropdown}
              className="w-40 p-2"
            >
              <DropdownItem
                tag="a"
                onItemClick={closeDropdown}
                className="flex w-full rounded-lg text-left font-normal text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                View More
              </DropdownItem>
              <DropdownItem
                tag="a"
                onItemClick={closeDropdown}
                className="flex w-full rounded-lg text-left font-normal text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                Delete
              </DropdownItem>
            </Dropdown>
          </div>
        </div>

        <div className="relative">
          {/*
            Recharts sizes % innerRadius/outerRadius off Math.min(width, height)/2.
            A short-but-wide container (e.g. h-[180px] w-full on a wide card) means
            height is always the limiting dimension, so the arc never grows with
            width. Fix: give recharts a SQUARE box (width === height, so width can
            be the limiting dimension), anchor it to the bottom of a 2:1 wrapper,
            crop the rest with overflow-hidden, and move the circle's center to
            the bottom of that square with cy="100%" so the top semicircle lands
            in the visible area.
          */}
          <div className="relative mx-auto aspect-2/1 w-full max-w-[340px] overflow-hidden">
            <div className="absolute inset-x-0 bottom-0 aspect-square w-full">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <RadialBarChart
                  data={chartDisplayData}
                  cx="50%"
                  cy="100%"
                  // Reversed sweep (left -> right) so the first stacked bar
                  // (revenue) starts at the left and the second (remaining)
                  // finishes at the right, per the target design.
                  startAngle={180}
                  endAngle={0}
                  barGap={0}
                  barCategoryGap={0}
                  innerRadius="75%"
                  outerRadius="90%"
                  barSize={14}
                >
                  {/*
                    Without an explicit domain, recharts infers the value
                    range from the largest single bar (revenue = 570), not
                    the stacked total (target = 755). That made "revenue"
                    fill the entire sweep and pushed "remaining" past the
                    domain edge, so it never rendered. Pinning the domain to
                    [0, target] fixes it.
                  */}
                  <PolarAngleAxis
                    type="number"
                    domain={[0, chartData.target]}
                    angleAxisId={0}
                    tick={false}
                  />
                  <RadialBar
                    dataKey="revenue"
                    fill="var(--color-brand-500)"
                    stackId="a"
                    cornerRadius={20}
                    className="stroke-transparent stroke-2"
                  />
                  <RadialBar
                    dataKey="remaining"
                    stackId="a"
                    cornerRadius={20}
                    fill="var(--color-gray-200)"
                    className="stroke-transparent stroke-2"
                  />
                  <ChartTooltip
                    wrapperStyle={{ zIndex: 1000 }}
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                </RadialBarChart>
              </ChartContainer>
            </div>

            {/* Plain overlay for the center label — far more predictable than
                positioning a <Label> inside a cy="100%" polar layout. */}
            <div className="pointer-events-none absolute inset-x-0 bottom-[20%] flex justify-center">
              <span className="text-3xl font-bold text-gray-800 dark:text-white/90">
                {percentage}%
              </span>
            </div>
          </div>

          <span className="bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500 absolute top-full left-1/2 -translate-x-1/2 -translate-y-[90%] rounded-full px-3 py-1 text-xs font-medium">
            +10%
          </span>
        </div>

        <p className="mx-auto mt-10 w-full max-w-[380px] text-center text-xs text-gray-500 sm:text-sm">
          You earn $3287 today, it&apos;s higher than last month. Keep up your
          good work!
        </p>
      </div>

      <div className="flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5">
        <div>
          <p className="text-theme-xs mb-1 text-center text-gray-500 sm:text-sm dark:text-gray-400">
            Target
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 sm:text-lg dark:text-white/90">
            $20K
            <ArrowDown size={16} className="text-error-500" />
          </p>
        </div>

        <div className="h-7 w-px bg-gray-200 dark:bg-gray-800"></div>

        <div>
          <p className="text-theme-xs mb-1 text-center text-gray-500 sm:text-sm dark:text-gray-400">
            Revenue
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 sm:text-lg dark:text-white/90">
            $15K
            <ArrowUp size={16} className="text-success-500" />
          </p>
        </div>

        <div className="h-7 w-px bg-gray-200 dark:bg-gray-800"></div>

        <div>
          <p className="text-theme-xs mb-1 text-center text-gray-500 sm:text-sm dark:text-gray-400">
            Today
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 sm:text-lg dark:text-white/90">
            $3K
            <ArrowUp size={16} className="text-success-500" />
          </p>
        </div>
      </div>
    </div>
  );
}
