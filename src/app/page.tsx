import { Barchart } from "@/components/Chart/BarChart";
import { Piechart } from "@/components/Chart/PieChart";
import EmployeeCard from "@/components/Cards/EmployeeCard";
import { Roboto } from "next/font/google";
import React from "react";
import TimeSheet from "@/components/TimeSheet/TimeSheet";
import LineChart from "@/components/Chart/LineChart";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700"],
  subsets: ["latin"],
});
const Page = () => {
  return (
    <div className="sm:p-4 p-2 flex flex-col gap-6 min-h-screen">
      <h1
        className={`text-bg_orange dark:text-white text-2xl font-normal ${roboto.className}`}
      >
        Dashboard
      </h1>
      <div className="flex flex-wrap gap-4">
        <EmployeeCard colorgradtop="#5f59f6" colorgradbottom="#8984ea" />
        <EmployeeCard colorgradtop="#ff6a72" colorgradbottom="#ff806f" />
        <EmployeeCard colorgradtop="#7265cf" colorgradbottom="#8b64b8" />
        <EmployeeCard colorgradtop="#0f87ba" colorgradbottom="#51b7ce" />
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-6">
        <TimeSheet />
        <Piechart />
      </div>
      <div>
        <Barchart />
      </div>
    </div>
  );
};

export default Page;
