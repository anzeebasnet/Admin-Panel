"use client";
import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export function MyDoughnutChart() {

let data= [
  {
    label: "Rental",
    value: 55,
    color: "#5b55f6",
    cutout: "70%",
  },
  {
    label: "Office Management",
    value:45,
    color: "#6963f2",
    cutout: "70%",
  },
  {
    label: "Photo Editing",
    value: 40,
    color: "#817cec",
    cutout: "70%",
  },
  {
    label: "Library Management",
    value: 30,
    color: "#817cec",
    cutout: "70%",
  },
]

  const options: any = {
    plugins: {
      responsive: true,
    },
    cutout: data.map((item) => item.cutout),
  };

  const finalData = {
    // labels: data.map((item) => item.label),
    datasets: [
      {
        data: data.map((item) => Math.round(item.value)),
        backgroundColor: data.map((item) => item.color),
        borderColor: data.map((item) => item.color),
        borderWidth: 1,
        dataVisibility: new Array(data.length).fill(true),
      },
    ],
  };

  return <Doughnut data={finalData} options={options} />;
}