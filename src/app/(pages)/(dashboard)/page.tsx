import { Barchart } from "@/components/Chart/BarChart";
import { Piechart } from "@/components/Chart/PieChart";
import EmployeeCard from "@/components/Cards/EmployeeCard";
import React from "react";
import TimeSheet from "@/components/TimeSheet/TimeSheet";
import LineChart from "@/components/Chart/LineChart";

const Page = () => {
  return (
    <div className=" p-2 flex flex-col gap-6 min-h-screen">
      <div className="flex flex-wrap gap-4">
        <EmployeeCard colorgradtop="#5f59f6" colorgradbottom="#8984ea" />
        <EmployeeCard colorgradtop="#ff6a72" colorgradbottom="#ff806f" />
        <EmployeeCard colorgradtop="#7265cf" colorgradbottom="#8b64b8" />
        <EmployeeCard colorgradtop="#0f87ba" colorgradbottom="#51b7ce" />
      </div>
      <div className="flex sm:flex-nowrap flex-wrap gap-x-4 gap-y-6">
        <TimeSheet />
        <Piechart />
      </div>
      <div className="flex md:flex-nowrap flex-wrap gap-x-4 gap-y-6">
        <Barchart />
        <LineChart />
      </div>
    </div>
  );
};

export default Page;
