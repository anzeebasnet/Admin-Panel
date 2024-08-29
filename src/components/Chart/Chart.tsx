"use client";

import { Bar, BarChart } from "recharts";

import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { MdKeyboardArrowDown } from "react-icons/md";

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

export function Chart() {
  return (
    <div className="bg-[#131731] p-8 w-[50%] rounded-3xl">
      <div className="flex justify-between">
        <h2 className="text-white font-medium text-lg">TimeSheet</h2>
        <div className="flex gap-2 py-2 px-4 border-2 border-gray-400 rounded-3xl">
            <p className="text-xs text-white font-normal">October</p>
            <MdKeyboardArrowDown color="white"/>
        </div>
      </div>
      <ChartContainer
        config={chartConfig}
        className="max-h-[300px] max-w-[500px]"
        style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
      >
        <BarChart accessibilityLayer data={chartData}>
          <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
          <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
