"use client";
import { useEffect, useRef } from "react";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
} from "chart.js";
import { BiDotsVerticalRounded } from "react-icons/bi";

// Register necessary components
Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title
);

function Example() {
  const chartRef = useRef<Chart | null>(null); // Ref to store the chart instance

  useEffect(() => {
    const canvas = document?.getElementById(
      "myChart"
    ) as HTMLCanvasElement | null;

    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Destroy existing chart instance if it exists
        if (chartRef.current) {
          chartRef.current.destroy();
        }

        // Create a new chart instance and store it in the ref
        chartRef.current = new Chart(ctx, {
          type: "line",
          data: {
            labels: ["S", "M", "T", "W", "T", "F", "S"],
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
        });
      }
    }

    // Cleanup: Destroy the chart instance when the component unmounts
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, []);

  return (
    <div className="dark:bg-card_dark bg-white sm:p-8 p-4 md:w-[48%] sm:w-[70%] w-full rounded-md flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <h2 className="dark:text-white text-black font-medium sm:text-lg text-base">
          Customer Satisfaction
        </h2>
        <BiDotsVerticalRounded className="dark:text-white text-black sm:w-6 sm:h-6 w-5 h-5 " />
      </div>
      <div className="flex ">
        <div className="pt-0 rounded-xl w-full h-fit my-auto">
          <canvas
            id="myChart"
            className="sm:!w-full !w-[80vw] sm:!h-[300px] !h-[200px]"
          ></canvas>
        </div>
      </div>
    </div>
  );
}

export default Example;
