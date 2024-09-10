"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { TbMessageDots } from "react-icons/tb";
import { IoNotificationsOutline } from "react-icons/io5";
import Image from "next/image";
import { IoIosArrowDown } from "react-icons/io";
import { TbSearch } from "react-icons/tb";
import { RiMenuLine } from "react-icons/ri";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { Archivo } from "next/font/google";
import { usePathname } from "next/navigation";
import { PiSphereLight } from "react-icons/pi";
import { Kalam } from "next/font/google";
import { Anton } from "next/font/google";
import { RxCrossCircled, RxDashboard } from "react-icons/rx";
import { BsCameraVideo, BsFileEarmarkSpreadsheet } from "react-icons/bs";
import { HiOutlineDocumentReport, HiOutlineUsers } from "react-icons/hi";
import { MdOutlineEditNote } from "react-icons/md";
import { CiClock2 } from "react-icons/ci";
import { LiaTasksSolid } from "react-icons/lia";
import ThemeToggle from "../ThemeToggle/ThemeToggle";

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

const Header = () => {
  const pathname = usePathname();

  return (
    <header className="w-full xl:h-24 h-20 text-white flex items-center justify-between sm:px-8 px-2 py-4 pr-4 shadow-sm dark:shadow-gray gap-4">
      <div className="flex gap-4 items-center">
        {/*Sheet*/}
        <div className="lg:hidden block place-self-end sm:p-4 overflow-y-auto">
          <Sheet>
            <SheetTrigger className="pt-2">
                <RiMenuLine color="#eb5025" size={25}/>
            </SheetTrigger>
            <SheetContent className="dark:bg-bg_blue bg-white h-full overflow-y-auto">
              <SheetHeader className=" flex flex-col relative">
                <SheetClose>
                  <div className=" absolute top-1 right-1">
                    <RxCrossCircled
                      size={25}
                      className="dark:text-white text-black"
                    />
                  </div>
                </SheetClose>
                <SheetTitle>
                  <SheetClose asChild>
                    <Link
                      href={"/"}
                      className="w-full flex justify-center gap-1 xl:px-8 px-4 xl:py-7 py-4 xl:pb-4 pb-3 border-b border-b-vl_gray"
                    >
                      <PiSphereLight size={35} color="orange" />
                      <h2
                        className={`${anton.className} font-medium xl:text-3xl text-2xl dark:text-white text-bg_orange`}
                      >
                        WorkSphere
                      </h2>
                    </Link>
                  </SheetClose>
                </SheetTitle>
                <SheetDescription>
                  <div className="flex flex-col gap-4 p-4 pt-8 border-b border-b-vl_gray">
                    <h3 className="text-base font-medium dark:text-white text-black">
                      Analyze
                    </h3>
                    <div className={`flex flex-col sm:gap-4 gap-2 ${archivo.className}`}>
                      <SheetClose asChild>
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
                              className={` font-normal sm:text-lg text-sm ${
                                pathname === "/"
                                  ? "text-white"
                                  : "text-text_gray"
                              }`}
                            >
                              Dashboard
                            </p>
                          </span>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link href="/live-feed">
                          <span
                            className={`flex gap-4 items-center p-2 px-4 rounded-3xl ${
                              pathname === "/live-feed" ? "bg-bg_orange" : ""
                            }`}
                          >
                            <BsCameraVideo
                              size={25}
                              color={`${
                                pathname === "/live-feed" ? "white" : "gray"
                              }`}
                            />
                            <p
                              className={`" font-medium sm:text-lg text-sm ${
                                pathname === "/live-feed"
                                  ? "text-white"
                                  : "text-text_gray"
                              }`}
                            >
                              Live Feed
                            </p>
                          </span>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link href="/timesheet">
                          <span
                            className={`flex gap-4 items-center p-2 px-4 rounded-3xl ${
                              pathname === "/timesheet" ? "bg-bg_orange" : ""
                            }`}
                          >
                            <BsFileEarmarkSpreadsheet
                              size={26}
                              color={`${
                                pathname === "/timesheet" ? "white" : "gray"
                              }`}
                            />
                            <p
                              className={` font-normal sm:text-lg text-sm ${
                                pathname === "/timesheet"
                                  ? "text-white"
                                  : "text-text_gray"
                              }`}
                            >
                              Timesheets
                            </p>
                          </span>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link href="/report">
                          <span
                            className={`flex gap-4 items-center p-2 px-4 rounded-3xl ${
                              pathname === "/report" ? "bg-bg_orange" : ""
                            }`}
                          >
                            <HiOutlineDocumentReport
                              size={26}
                              color={`${
                                pathname === "/report" ? "white" : "gray"
                              }`}
                            />
                            <p
                              className={` font-normal sm:text-lg text-sm ${
                                pathname === "/report"
                                  ? "text-white"
                                  : "text-text_gray"
                              }`}
                            >
                              Reports
                            </p>
                          </span>
                        </Link>
                      </SheetClose>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 p-4 pt-8">
                    <h3 className="text-base font-medium dark:text-white text-black">
                      Manage
                    </h3>
                    <div className={`flex flex-col sm:gap-4 gap-2  ${archivo.className}`}>
                      <SheetClose asChild>
                        <Link href="/tasks">
                          <span
                            className={`flex gap-4 items-center p-2 px-4 rounded-3xl ${
                              pathname === "/tasks" ? "bg-bg_orange" : ""
                            }`}
                          >
                            <LiaTasksSolid
                              size={26}
                              color={`${
                                pathname === "/tasks" ? "white" : "gray"
                              }`}
                            />
                            <p
                              className={` font-normal sm:text-lg text-sm ${
                                pathname === "/tasks"
                                  ? "text-white"
                                  : "text-text_gray"
                              }`}
                            >
                              Tasks
                            </p>
                          </span>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link href="/clock">
                          <span
                            className={`flex gap-4 items-center p-2 px-4 rounded-3xl ${
                              pathname === "/clock" ? "bg-bg_orange" : ""
                            }`}
                          >
                            <CiClock2
                              size={25}
                              color={`${
                                pathname === "/clock" ? "white" : "gray"
                              }`}
                            />
                            <p
                              className={`" font-medium sm:text-lg text-sm ${
                                pathname === "/clock"
                                  ? "text-white"
                                  : "text-text_gray"
                              }`}
                            >
                              Clock In/Out
                            </p>
                          </span>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link href="/projects">
                          <span
                            className={`flex gap-4 items-center p-2 px-4 rounded-3xl ${
                              pathname === "/projects" ? "bg-bg_orange" : ""
                            }`}
                          >
                            <MdOutlineEditNote
                              size={26}
                              color={`${
                                pathname === "/projects" ? "white" : "gray"
                              }`}
                            />
                            <p
                              className={` font-normal sm:text-lg text-sm ${
                                pathname === "/projects"
                                  ? "text-white"
                                  : "text-text_gray"
                              }`}
                            >
                              Projects
                            </p>
                          </span>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link href="/clients">
                          <span
                            className={`flex gap-4 items-center p-2 px-4 rounded-3xl ${
                              pathname === "/clients" ? "bg-bg_orange" : ""
                            }`}
                          >
                            <HiOutlineUsers
                              size={26}
                              color={`${
                                pathname === "/clients" ? "white" : "gray"
                              }`}
                            />
                            <p
                              className={` font-normal sm:text-lg text-sm ${
                                pathname === "/clients"
                                  ? "text-white"
                                  : "text-text_gray"
                              }`}
                            >
                              Clients
                            </p>
                          </span>
                        </Link>
                      </SheetClose>
                    </div>
                  </div>
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>

        <div className="sm:block hidden relative md:w-80 sm:w-40 w-24">
          <TbSearch className="absolute top-1/2 sm:left-3 left-1 transform -translate-y-1/2 dark:text-white text-black" />
          <Input
            className="w-full sm:pl-10 pl-6 bg-white dark:bg-bg_blue border dark:border-gray rounded-3xl focus:ring-0 dark:text-white text-black"
            placeholder="Search"
          />
        </div>
        <div className="sm:hidden block">
          <TbSearch className=" dark:text-white text-black" size={25} />
        </div>
      </div>
      <div className="flex items-center justify-center gap-3">
        <ThemeToggle />
        <div className="flex items-center justify-center sm:gap-3 gap-1">
          <div className="dark:bg-blue bg-white sm:w-10 w-8 h-8 sm:h-10 flex items-center justify-center rounded-full">
            <IoNotificationsOutline
              size={25}
              className="dark:text-white text-black"
            />
          </div>
          <div className="dark:bg-blue bg-white sm:w-10 w-8 h-8 sm:h-10 flex items-center justify-center rounded-full">
            <TbMessageDots size={25} className="dark:text-white text-black" />
          </div>
          <div className="flex sm:gap-3 items-center">
            <div className="flex gap-1 items-center">
              <Image
                src={"/images/girl.jpeg"}
                alt="profile"
                width={100}
                height={100}
                className="rounded-full sm:w-12 w-8 h-8 sm:h-12 border-2 border-white"
              />
              <p className="dark:text-white text-black font-medium sm:text-base text-sm sm:block hidden">
                Jane Smith
              </p>
            </div>
            <IoIosArrowDown className="dark:text-white text-black" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
