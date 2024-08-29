import { Chart } from "@/components/Chart/Chart";
import { MyDoughnutChart } from "@/components/DoughnutChart/DoughnutChart";
import EmployeeCard from "@/components/EmployeeCard/EmployeeCard";
import { Piechart } from "@/components/PieChart/PieChart";
import { Roboto } from "next/font/google";
import React from "react";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700"],
  subsets: ["latin"],
});
const Page = () => {
  return (
    <div className="p-4 flex flex-col gap-6">
      <h1 className={`text-white text-2xl font-normal ${roboto.className}`}>
        Dashboard
      </h1>
      <div className="flex flex-wrap gap-4">
        <EmployeeCard colorgradtop="#5f59f6" colorgradbottom="#8984ea" />
        <EmployeeCard colorgradtop="#ff6a72" colorgradbottom="#ff806f" />
        <EmployeeCard colorgradtop="#7265cf" colorgradbottom="#8b64b8" />
        <EmployeeCard colorgradtop="#0f87ba" colorgradbottom="#51b7ce" />
      </div>
      <div className="flex flex-wrap gap-4">
          <Chart />
          {/* <Piechart /> */}
          <div className="w-80 h-60">
          <MyDoughnutChart/>
          </div>
      </div>
    </div>
  );
};

export default Page;
