"use client";

import { useState } from "react";
import { Ellipsis } from "lucide-react";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartData = [
  { month: "January", subscription: 186 },
  { month: "February", subscription: 305 },
  { month: "March", subscription: 237 },
  { month: "April", subscription: 73 },
  { month: "May", subscription: 209 },
  { month: "June", subscription: 214 },
  { month: "July", subscription: 253 },
  { month: "August", subscription: 114 },
  { month: "September", subscription: 314 },
  { month: "October", subscription: 140 },
  { month: "November", subscription: 165 },
  { month: "December", subscription: 190 },
];

const chartConfig = {
  subscription: {
    label: "Subscription",
    color: "var(--color-brand-500)",
  },
} satisfies ChartConfig;

export default function MonthlySalesChart() {
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 sm:px-6 sm:pt-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Monthly Sales
        </h3>

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
              onItemClick={closeDropdown}
              className="flex w-full rounded-lg text-left font-normal text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              View More
            </DropdownItem>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full rounded-lg text-left font-normal text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Delete
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="custom-scrollbar max-w-full overflow-x-auto">
        <div className="-ml-5 min-w-[650px] pl-2 xl:min-w-full">
          <ChartContainer config={chartConfig} className="h-[195px] w-full">
            <BarChart
              accessibilityLayer
              data={chartData}
              barSize={20}
              margin={{ top: 20, bottom: 10 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis
                tickCount={12}
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                dataKey="subscription"
                fill="var(--color-subscription)"
                radius={6}
              >
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}
