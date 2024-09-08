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
import { HiOutlineDocumentReport, HiOutlineUsers } from "react-icons/hi";
import { LiaTasksSolid } from "react-icons/lia";
import { GiWatch } from "react-icons/gi";
import { CiClock2 } from "react-icons/ci";
import { MdOutlineEditNote } from "react-icons/md";

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
    <div className="bg-gray dark:bg-bg_blue lg:flex flex-col hidden gap-2 h-screen w-[18%] p-4 shadow-md dark:shadow-bg_gray overflow-y-auto">
      {/*Logo*/}
      <Link
        href={"/"}
        className="w-full flex justify-center gap-1 xl:px-8 px-4 xl:py-7 py-4 xl:pb-4 pb-3"
      >
        <PiSphereLight size={35} color="orange" />
        <h2
          className={`${anton.className} font-medium xl:text-3xl text-2xl dark:text-white text-bg_orange`}
        >
          WorkSphere
        </h2>
      </Link>

      <div className="flex flex-col gap-4 p-4 pt-8">
        <h3 className="text-base font-medium text-white ">Analyze</h3>
        <div className={`flex flex-col gap-4 ${archivo.className}`}>
          <Link href="/">
            <span
              className={`flex gap-4 items-center p-2 px-4 rounded-3xl ${
                pathname === "/" ? "bg-bg_orange" : ""
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
          <Link href="/timesheet">
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
          <Link href="/report">
            <span
              className={`flex gap-4 items-center p-2 px-4 rounded-3xl ${
                pathname === "/report" ? "bg-[#ff693c]" : ""
              }`}
            >
              <HiOutlineDocumentReport
                size={28}
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
      <div className="w-full border-b border-gray-500"></div>
      <div className="flex flex-col gap-4 p-4 pt-8">
        <h3 className="text-base font-medium text-white ">Manage</h3>
        <div className={`flex flex-col gap-4 ${archivo.className}`}>
          <Link href="/tasks">
            <span
              className={`flex gap-4 items-center p-2 px-4 rounded-3xl ${
                pathname === "/tasks" ? "bg-[#ff693c]" : ""
              }`}
            >
              <LiaTasksSolid
                size={26}
                color={`${pathname === "/tasks" ? "white" : "gray"}`}
              />
              <p
                className={` font-normal text-lg ${
                  pathname === "/tasks" ? "text-white" : "text-[#767c8e]"
                }`}
              >
                Tasks
              </p>
            </span>
          </Link>
          <Link href="/clock">
            <span
              className={`flex gap-4 items-center p-2 px-4 rounded-3xl ${
                pathname === "/clock" ? "bg-[#ff693c]" : ""
              }`}
            >
              <CiClock2
                size={25}
                color={`${pathname === "/clock" ? "white" : "gray"}`}
              />
              <p
                className={`" font-medium text-lg ${
                  pathname === "/clock" ? "text-white" : "text-[#767c8e]"
                }`}
              >
                Clock In/Out
              </p>
            </span>
          </Link>
          <Link href="/projects">
            <span
              className={`flex gap-4 items-center p-2 px-4 rounded-3xl ${
                pathname === "/projects" ? "bg-[#ff693c]" : ""
              }`}
            >
              <MdOutlineEditNote
                size={26}
                color={`${pathname === "/projects" ? "white" : "gray"}`}
              />
              <p
                className={` font-normal text-lg ${
                  pathname === "/projects" ? "text-white" : "text-[#767c8e]"
                }`}
              >
                Projects
              </p>
            </span>
          </Link>
          <Link href="/clients">
            <span
              className={`flex gap-4 items-center p-2 px-4 rounded-3xl ${
                pathname === "/clients" ? "bg-[#ff693c]" : ""
              }`}
            >
              <HiOutlineUsers
                size={26}
                color={`${pathname === "/clients" ? "white" : "gray"}`}
              />
              <p
                className={` font-normal text-lg ${
                  pathname === "/clients" ? "text-white" : "text-[#767c8e]"
                }`}
              >
                Clients
              </p>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
