'use client';

import { useEffect, useRef } from "react";
import {
  Chart,
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from "chart.js";
import { BiDotsVerticalRounded } from "react-icons/bi";

function LineChart() {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Register necessary components
    Chart.register(LineController, CategoryScale, LinearScale, PointElement, LineElement, Title);

    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        const myChart = new Chart(ctx, {
          type: "line",
          data: {
            labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            datasets: [
              {
                data: [86, 114, 106, 106, 107, 111, 133],
                label: "Applied",
                borderColor: "#3e95cd",
                backgroundColor: "#7bb6dd",
                fill: false,
              },
              {
                data: [70, 90, 44, 60, 83, 90, 100],
                label: "Accepted",
                borderColor: "#3cba9f",
                backgroundColor: "#71d1bd",
                fill: false,
              },
              {
                data: [10, 21, 60, 44, 17, 21, 17],
                label: "Pending",
                borderColor: "#ffa500",
                backgroundColor: "#ffc04d",
                fill: false,
              },
              {
                data: [6, 3, 2, 2, 7, 0, 16],
                label: "Rejected",
                borderColor: "#c45850",
                backgroundColor: "#d78f89",
                fill: false,
              },
            ],
          },
          options: {
            maintainAspectRatio: false,
            responsive: true,
            scales: {
              x: {
                display: true,
              },
              y: {
                display: true,
              }
            }
          }
        });

        // Cleanup chart on unmount
        return () => {
          myChart.destroy();
        };
      }
    }
  }, []);

  return (
    <div className="bg-white dark:bg-dark_gray  p-8 rounded-xl flex flex-col gap-6">
      {/* Line Chart */}
      <div className="flex justify-between">
        <h2 className="dark:text-white text-black font-medium text-lg">Tasks Completed</h2>
        <BiDotsVerticalRounded size={25} className="dark:text-white text-black"/>
      </div>
      <div className=" w-[1100px] h-screen flex mx-auto my-auto">
        <div className="border border-gray-400 pt-0 rounded-xl w-full sm:h-[400px] h-fit shadow-xl">
          <canvas ref={chartRef} id="myChart"></canvas>
        </div>
      </div>
    </div>

    // <>
    //   {/* line chart */}
    //   <h1 className="w-[110px] mx-auto mt-10 text-xl font-semibold capitalize ">line Chart</h1>
    //   <div className="w-[1100px] h-screen flex mx-auto my-auto">
    //     <div className='border border-gray-400 pt-0 rounded-xl  w-full h-fit my-auto  shadow-xl'>
    //       <canvas id='myChart'></canvas>
    //     </div>
    //   </div>
    // </>
  );
}

export default LineChart;