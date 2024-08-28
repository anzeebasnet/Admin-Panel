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

const Header = () => {
  const pathname = usePathname();

  return (
    <header className="w-full xl:h-24 h-20 text-white flex items-center justify-between sm:px-8 px-2 py-4 shadow-sm shadow-gray-400 ">
      <div className="flex sm:gap-6 gap-2 items-center">
        {/*Sheet*/}
        <div className="lg:hidden block place-self-end p-4">
          <Sheet>
            <SheetTrigger>
              <RiMenuLine color="#eb5025" size={30} />
            </SheetTrigger>
            <SheetContent className="bg-[#090c2a]">
              <SheetHeader className=" flex flex-col relative">
                <SheetClose>
                  <div className=" absolute top-2 right-2">
                    <RxCrossCircled size={25} color="white" />
                  </div>
                </SheetClose>
                <SheetTitle>
                  {" "}
                  <div className="">
                    {/*Logo*/}
                    <div className="w-full flex justify-center gap-1 xl:px-8 px-4 xl:py-7 py-4 xl:pb-4 pb-3 border-b border-b-[#8f8f8f]">
                      <PiSphereLight size={35} color="orange" />
                      <h2
                        className={`${anton.className} font-medium xl:text-3xl text-2xl text-white`}
                      >
                        WorkSphere
                      </h2>
                    </div>
                  </div>
                </SheetTitle>
                <SheetDescription>
                  {/*dashboard items*/}
                  <div
                    className={`flex flex-col gap-4 p-4 pt-8 ${archivo.className}`}
                  >
                    <SheetClose asChild>
                      <Link href="/">
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
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/live-feed">
                        <span
                          className={`flex gap-4 items-center p-2 px-4 rounded-3xl ${
                            pathname === "/live-feed" ? "bg-[#ff693c]" : ""
                          }`}
                        >
                          <BsCameraVideo
                            size={25}
                            color={`${
                              pathname === "/live-feed" ? "white" : "gray"
                            }`}
                          />
                          <p
                            className={`" font-medium text-lg ${
                              pathname === "/live-feed"
                                ? "text-white"
                                : "text-[#767c8e]"
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
                            pathname === "/timesheet" ? "bg-[#ff693c]" : ""
                          }`}
                        >
                          <BsFileEarmarkSpreadsheet
                            size={26}
                            color={`${
                              pathname === "/timesheet" ? "white" : "gray"
                            }`}
                          />
                          <p
                            className={` font-normal text-lg ${
                              pathname === "/timesheet"
                                ? "text-white"
                                : "text-[#767c8e]"
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
                            pathname === "/report" ? "bg-[#ff693c]" : ""
                          }`}
                        >
                          <HiOutlineDocumentReport
                            size={26}
                            color={`${
                              pathname === "/report" ? "white" : "gray"
                            }`}
                          />
                          <p
                            className={` font-normal text-lg ${
                              pathname === "/report"
                                ? "text-white"
                                : "text-[#767c8e]"
                            }`}
                          >
                            Reports
                          </p>
                        </span>
                      </Link>
                    </SheetClose>
                  </div>
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>

        <div className="relative md:w-80 sm:w-40 w-24">
          <TbSearch className="absolute top-1/2 sm:left-3 left-1 transform -translate-y-1/2" />
          <Input
            className="w-full sm:pl-10 pl-6 bg-[#090c2a] border border-gray-400 rounded-3xl focus:ring-0 text-gray-400"
            placeholder="Search"
          />
        </div>
      </div>
      <div className="flex items-center justify-center sm:gap-3 gap-1">
        <div className="bg-[#2c326e] w-10 h-10 flex items-center justify-center rounded-full">
          <IoNotificationsOutline size={25} />
        </div>
        <div className="bg-[#2c326e] w-10 h-10 flex items-center justify-center rounded-full">
          <TbMessageDots size={25} />
        </div>
        <div className="flex sm:gap-3 items-center">
          <div className="flex gap-1 items-center">
            <Image
              src={"/images/girl.jpeg"}
              alt="profile"
              width={100}
              height={100}
              className="rounded-full w-12 h-12 border-2 border-white"
            />
            <p className="text-white font-medium text-base sm:block hidden">
              Jane Smith
            </p>
          </div>
          <IoIosArrowDown color="white" />
        </div>
      </div>
    </header>
  );
};

export default Header;
