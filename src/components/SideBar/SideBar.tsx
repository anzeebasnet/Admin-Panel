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
import Image from "next/image";

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
        className="w-full flex justify-center gap-1 xl:px-8 px-2 xl:py-7 py-4 xl:pb-4 pb-3 border-b border-b-gray-500"
      >
        <PiSphereLight size={35} color="orange" />
        <h2
          className={`${anton.className} font-medium xl:text-3xl text-2xl dark:text-white text-bg_orange`}
        >
          WorkSphere
        </h2>
      </Link>

      <div className="flex flex-col gap-4 xl:px-4 py-4 pt-8 border-b border-gray-500">
        <h3 className="text-base font-medium dark:text-white text-black">
          Analyze
        </h3>
        <div className={`flex flex-col gap-1 ${archivo.className}`}>
          <Link href="/">
            <span
              className={`flex gap-4 items-center p-2 px-4 rounded-3xl ${
                pathname === "/" ? "bg-bg_orange" : ""
              }`}
            >
              <RxDashboard
                size={25}
                className={`${
                  pathname === "/"
                    ? "text-white"
                    : "dark:text-white text-text_gray"
                }`}
              />
              <p
                className={` font-normal xl:text-lg text-base ${
                  pathname === "/"
                    ? "text-white"
                    : "dark:text-white text-text_gray"
                }`}
              >
                Dashboard
              </p>
            </span>
          </Link>
          <Link href="/live-feed">
            <span
              className={`flex gap-4 items-center p-2 px-4 rounded-3xl ${
                pathname === "/live-feed" ? "bg-bg_orange" : ""
              }`}
            >
              <BsCameraVideo
                size={25}
                className={`${
                  pathname === "/live-feed"
                    ? "text-white"
                    : "dark:text-white text-text_gray"
                }`}
              />
              <p
                className={`" font-normal xl:text-lg text-base ${
                  pathname === "/live-feed"
                    ? "text-white"
                    : "dark:text-white text-text_gray"
                }`}
              >
                Live Feed
              </p>
            </span>
          </Link>
          <Link href="/timesheet">
            <span
              className={`flex gap-4 items-center p-2 px-4 rounded-3xl ${
                pathname === "/timesheet" ? "bg-bg_orange" : ""
              }`}
            >
              <BsFileEarmarkSpreadsheet
                size={25}
                className={`${
                  pathname === "/timesheet"
                    ? "text-white"
                    : "dark:text-white text-text_gray"
                }`}
              />
              <p
                className={` font-normal xl:text-lg text-base ${
                  pathname === "/timesheet"
                    ? "text-white"
                    : "dark:text-white text-text_gray"
                }`}
              >
                Timesheets
              </p>
            </span>
          </Link>
          <Link href="/report">
            <span
              className={`flex gap-4 items-center p-2 px-4 rounded-3xl ${
                pathname === "/report" ? "bg-bg_orange" : ""
              }`}
            >
              <HiOutlineDocumentReport
                size={28}
                className={`${
                  pathname === "/report"
                    ? "text-white"
                    : "dark:text-white text-text_gray"
                }`}
              />
              <p
                className={` font-normal xl:text-lg text-base ${
                  pathname === "/report"
                    ? "text-white"
                    : "dark:text-white text-text_gray"
                }`}
              >
                Reports
              </p>
            </span>
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-4 xl:px-4 py-4 pt-8">
        <h3 className="text-base font-medium dark:text-white text-black">
          Manage
        </h3>
        <div className={`flex flex-col gap-1 ${archivo.className}`}>
          <Link href="/tasks">
            <span
              className={`flex gap-4 items-center p-2 px-4 rounded-3xl ${
                pathname === "/tasks" ? "bg-bg_orange" : ""
              }`}
            >
              <LiaTasksSolid
                size={26}
                className={`${
                  pathname === "/tasks"
                    ? "text-white"
                    : "dark:text-white text-text_gray"
                }`}
              />
              <p
                className={` font-normal xl:text-lg text-base ${
                  pathname === "/tasks"
                    ? "text-white"
                    : "dark:text-white text-text_gray"
                }`}
              >
                Tasks
              </p>
            </span>
          </Link>
          <Link href="/clock">
            <span
              className={`flex gap-4 items-center p-2 px-4 rounded-3xl ${
                pathname === "/clock" ? "bg-bg_orange" : ""
              }`}
            >
              <CiClock2
                size={25}
                className={`${
                  pathname === "/clock"
                    ? "text-white"
                    : "dark:text-white text-text_gray"
                }`}
              />
              <p
                className={`" font-medium xl:text-lg text-base ${
                  pathname === "/clock"
                    ? "text-white"
                    : "dark:text-white text-text_gray"
                }`}
              >
                Clock In/Out
              </p>
            </span>
          </Link>
          <Link href="/projects">
            <span
              className={`flex gap-4 items-center p-2 px-4 rounded-3xl ${
                pathname === "/projects" ? "bg-bg_orange" : ""
              }`}
            >
              <MdOutlineEditNote
                size={26}
                className={`${
                  pathname === "/projects"
                    ? "text-white"
                    : "dark:text-white text-text_gray"
                }`}
              />
              <p
                className={` font-normal xl:text-lg text-base ${
                  pathname === "/projects"
                    ? "text-white"
                    : "dark:text-white text-text_gray"
                }`}
              >
                Projects
              </p>
            </span>
          </Link>
          <Link href="/clients">
            <span
              className={`flex gap-4 items-center p-2 px-4 rounded-3xl ${
                pathname === "/clients" ? "bg-bg_orange" : ""
              }`}
            >
              <HiOutlineUsers
                size={26}
                className={`${
                  pathname === "/clients"
                    ? "text-white"
                    : "dark:text-white text-text_gray"
                }`}
              />
              <p
                className={` font-normal xl:text-lg text-base ${
                  pathname === "/clients"
                    ? "text-white"
                    : "dark:text-white text-text_gray"
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
