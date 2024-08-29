"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BiDotsVerticalRounded } from "react-icons/bi";
const chartData = [
  { project: "rental", employees: 275, fill: "var(--color-rental)" },
  {
    project: "office_management",
    employees: 200,
    fill: "var(--color-office_management)",
  },
  { project: "editing", employees: 287, fill: "var(--color-editing)" },
  {
    project: "library_management",
    employees: 173,
    fill: "var(--color-library_management)",
  },
];

const chartConfig = {
  employees: {
    label: "Employees",
  },
  rental: {
    label: "Rental",
    color: "hsl(var(--chart-1))",
  },
  office_management: {
    label: "Office Management",
    color: "hsl(var(--chart-2))",
  },
  editing: {
    label: "Photo Editing",
    color: "hsl(var(--chart-3))",
  },
  library_management: {
    label: "Library Management",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export function Piechart() {
  const totalEmployees = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.employees, 0);
  }, []);

  return (
    <Card className="flex flex-col bg-[#131731] border-none sm:w-[40%] w-full">
      <CardHeader className="items-center pb-0">
        <div className="flex justify-center w-full">
          <CardTitle className="text-lg text-white font-medium place-self-start">
            Top Assigned Project
          </CardTitle>
          <BiDotsVerticalRounded size={25} color="white" />
        </div>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="employees"
              nameKey="project"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="text-3xl font-bold text-white"
                        >
                          {totalEmployees.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-white"
                        >
                          Total
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
