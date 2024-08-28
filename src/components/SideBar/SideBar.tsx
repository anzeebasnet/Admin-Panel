"use client";

import React from "react";
import Link from "next/link";
import { Archivo } from "next/font/google";
import { usePathname } from "next/navigation";
import { PiSphereLight } from "react-icons/pi";
import { Kalam } from "next/font/google";
import { Anton } from "next/font/google";
import { RxDashboard } from "react-icons/rx";
import { BsCameraVideo } from "react-icons/bs";
import { BsFileEarmarkSpreadsheet } from "react-icons/bs";
import { HiOutlineDocumentReport } from "react-icons/hi";



const archivo = Archivo({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

const kalam = Kalam({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
});

const anton = Anton({
  weight: ["400"],
  subsets: ["latin"],
});

const SideBar = () => {
  const pathname = usePathname();

  return (
    <div className="bg-[#090c2a]  h-screen w-[22%] p-4 shadow-md shadow-gray-500 lg:flex flex-col  hidden">
        {/*Logo*/}
        <div className="w-full flex justify-center gap-1 xl:px-8 px-4 xl:py-7 py-4 xl:pb-4 pb-3">
          <PiSphereLight
            size={35}
            color="orange"
          />
          <h2
            className={`${anton.className} font-medium xl:text-3xl text-2xl text-white`}
          >
            WorkSphere
          </h2>
        </div>

        {/*dashboard items*/}
        <div className={`flex flex-col gap-4 p-4 pt-8 ${archivo.className}`}>
          <Link href="/" >
            <span
              className={`flex gap-4 items-center p-2 px-4 rounded-3xl ${
                pathname === "/" ? "bg-[#ff693c]" : ""
              }`}
            >
              <RxDashboard 
                size={26}
                color={`${pathname === "/" ? "white" : "gray"}`}
              />
              <p
                className={` font-normal text-lg ${
                  pathname === "/" ? "text-white" : "text-[#767c8e]"
                }`}
              >
                Dashboard
              </p>
            </span>
          </Link>
          <Link href="/live-feed">
            <span
              className={`flex gap-4 items-center p-2 px-4 rounded-3xl ${
                pathname === "/live-feed" ? "bg-[#ff693c]" : ""
              }`}
            >
              <BsCameraVideo
                size={25}
                color={`${pathname === "/live-feed" ? "white" : "gray"}`}
              />
              <p
                className={`" font-medium text-lg ${
                  pathname === "/live-feed" ? "text-white" : "text-[#767c8e]"
                }`}
              >
                Live Feed
              </p>
            </span>
          </Link>
          <Link href="/timesheet" >
            <span
              className={`flex gap-4 items-center p-2 px-4 rounded-3xl ${
                pathname === "/timesheet" ? "bg-[#ff693c]" : ""
              }`}
            >
              <BsFileEarmarkSpreadsheet 
                size={26}
                color={`${pathname === "/timesheet" ? "white" : "gray"}`}
              />
              <p
                className={` font-normal text-lg ${
                  pathname === "/timesheet" ? "text-white" : "text-[#767c8e]"
                }`}
              >
                Timesheets
              </p>
            </span>
          </Link>
          <Link href="/report" >
            <span
              className={`flex gap-4 items-center p-2 px-4 rounded-3xl ${
                pathname === "/report" ? "bg-[#ff693c]" : ""
              }`}
            >
              <HiOutlineDocumentReport 
                size={26}
                color={`${pathname === "/report" ? "white" : "gray"}`}
              />
              <p
                className={` font-normal text-lg ${
                  pathname === "/report" ? "text-white" : "text-[#767c8e]"
                }`}
              >
                Reports
              </p>
            </span>
          </Link>
        </div>
    </div>
  );
};

export default SideBar;
