"use client";

import { Bar, BarChart } from "recharts";

import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { MdKeyboardArrowDown } from "react-icons/md";
import { BiDotsVerticalRounded } from "react-icons/bi";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

export function Barchart() {
  return (
    <div className="dark:bg-card_dark bg-white  sm:p-8 p-4 md:w-[50%] sm:w-[70%] w-full rounded-md flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="dark:text-white text-black font-medium sm:text-lg text-base">
          Weekly Report
        </h2>
        <BiDotsVerticalRounded className="dark:text-white text-black sm:w-6 sm:h-6 w-5 h-5 " />
      </div>
      <ChartContainer
        config={chartConfig}
        className="max-h-[500px] max-w-[500px]"
      >
        <BarChart accessibilityLayer data={chartData}>
          <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
          <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
