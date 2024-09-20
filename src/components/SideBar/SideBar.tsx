"use client";

import React from "react";
import Link from "next/link";
import { Archivo } from "next/font/google";
import { usePathname } from "next/navigation";
import { PiSphereLight } from "react-icons/pi";
import { Kalam } from "next/font/google";
import { Anton } from "next/font/google";
import { RxDashboard } from "react-icons/rx";
import { BsCameraVideo, BsDoorClosed } from "react-icons/bs";
import { BsFileEarmarkSpreadsheet } from "react-icons/bs";
import { HiOutlineDocumentReport, HiOutlineUsers } from "react-icons/hi";
import { LiaTasksSolid } from "react-icons/lia";
import { CiClock2 } from "react-icons/ci";
import { MdOutlineEditNote } from "react-icons/md";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "../ui/button";
import { signOut, useSession } from "next-auth/react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { BsDoorOpenFill } from "react-icons/bs";
import { BsFillDoorClosedFill } from "react-icons/bs";

const archivo = Archivo({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

const anton = Anton({
  weight: ["400"],
  subsets: ["latin"],
});

const SideBar = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = React.useState(true);

  const handleLogout = () => {
    signOut();
  };

  return (
    <div className="bg-gray dark:bg-bg_blue lg:flex flex-col hidden gap-2 h-screen p-4 shadow-md dark:shadow-bg_gray overflow-y-auto">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="collapsible-trigger flex items-center justify-center mx-auto">
          {isOpen ? (
            <div className="flex gap-2 items-center justify-center">
              <Link
                href={"/"}
                prefetch={true}
                className="w-full flex justify-center gap-1 px-auto py-4 xl:pb-4 pb-3 border-b border-b-gray-500"
              >
                <PiSphereLight size={25} className="text-bg_orange" />
                <h2
                  className={`${anton.className} font-medium xl:text-xl text-lg text-bg_orange`}
                >
                  MoreClub
                </h2>
              </Link>
              <BsDoorClosed size={30} className="pb-1" />
            </div>
          ) : (
            <div className="py-4">
              <BsDoorOpenFill size={25} />
            </div>
          )}
        </CollapsibleTrigger>

        <CollapsibleContent
          className={`collapsible-content ${isOpen ? "open" : ""}`}
        >
          <div
            className={`flex flex-col gap-4 xl:px-4 py-2 ${archivo.className}`}
          >
            <div className="flex flex-col gap-1">
              <Link href="/" prefetch={true}>
                <span
                  className={`flex gap-4 items-center py-1 px-4 rounded-3xl ${
                    pathname === "/" ? "bg-bg_orange" : ""
                  }`}
                >
                  <RxDashboard
                    size={20}
                    className={`${
                      pathname === "/"
                        ? "text-white"
                        : "dark:text-white text-text_gray"
                    }`}
                  />
                  <p
                    className={` font-normal  text-sm ${
                      pathname === "/"
                        ? "text-white"
                        : "dark:text-white text-text_gray"
                    }`}
                  >
                    Dashboard
                  </p>
                </span>
              </Link>
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger
                    className={`py-1 px-4 rounded-3xl ${
                      pathname === "/users" ? "bg-bg_orange" : ""
                    }`}
                  >
                    <Link href="/users" prefetch={true}>
                      <span className={`flex gap-4 items-center `}>
                        <HiOutlineUsers
                          size={20}
                          className={`${
                            pathname === "/users"
                              ? "text-white"
                              : "dark:text-white text-text_gray"
                          }`}
                        />
                        <p
                          className={` font-normal  text-sm ${
                            pathname === "/users"
                              ? "text-white"
                              : "dark:text-white text-text_gray"
                          }`}
                        >
                          Users
                        </p>
                      </span>
                    </Link>
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col">
                    <Link
                      href={"/timesheet/daily"}
                      prefetch={true}
                      className={`${
                        pathname === "/timesheet/daily"
                          ? "bg-bg_orange text-white"
                          : "dark:text-white text-text_gray"
                      } py-1 px-4 rounded-3xl font-normal  text-sm`}
                    >
                      Daily
                    </Link>
                    <Link
                      href={"/timesheet/weekly"}
                      prefetch={true}
                      className={`${
                        pathname === "/timesheet/weekly"
                          ? "bg-bg_orange text-white"
                          : "dark:text-white text-text_gray"
                      } py-1 px-4 rounded-3xl font-normal  text-sm`}
                    >
                      Weekly
                    </Link>
                    <Link
                      href={"/timesheet/monthly"}
                      prefetch={true}
                      className={`${
                        pathname === "/timesheet/monthly"
                          ? "bg-bg_orange text-white"
                          : "dark:text-white text-text_gray"
                      } py-1 px-4 rounded-3xl font-normal  text-sm`}
                    >
                      Monthly
                    </Link>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <Link href="/live-feed" prefetch={true}>
                <span
                  className={`flex gap-4 items-center py-1 px-4 rounded-3xl ${
                    pathname === "/live-feed" ? "bg-bg_orange" : ""
                  }`}
                >
                  <BsCameraVideo
                    size={20}
                    className={`${
                      pathname === "/live-feed"
                        ? "text-white"
                        : "dark:text-white text-text_gray"
                    }`}
                  />
                  <p
                    className={`" font-normal  text-sm ${
                      pathname === "/live-feed"
                        ? "text-white"
                        : "dark:text-white text-text_gray"
                    }`}
                  >
                    Live Feed
                  </p>
                </span>
              </Link>
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    <span className="flex gap-4 items-center py-1 px-4 rounded-3xl">
                      <BsFileEarmarkSpreadsheet
                        size={20}
                        className="dark:text-white text-text_gray"
                      />
                      <p className="font-normal  text-sm dark:text-white text-text_gray">
                        Timesheets
                      </p>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col">
                    <Link
                      href={"/timesheet/daily"}
                      prefetch={true}
                      className={`${
                        pathname === "/timesheet/daily"
                          ? "bg-bg_orange text-white"
                          : "dark:text-white text-text_gray"
                      } py-1 px-4 rounded-3xl font-normal  text-sm`}
                    >
                      Daily
                    </Link>
                    <Link
                      href={"/timesheet/weekly"}
                      prefetch={true}
                      className={`${
                        pathname === "/timesheet/weekly"
                          ? "bg-bg_orange text-white"
                          : "dark:text-white text-text_gray"
                      } py-1 px-4 rounded-3xl font-normal  text-sm`}
                    >
                      Weekly
                    </Link>
                    <Link
                      href={"/timesheet/monthly"}
                      prefetch={true}
                      className={`${
                        pathname === "/timesheet/monthly"
                          ? "bg-bg_orange text-white"
                          : "dark:text-white text-text_gray"
                      } py-1 px-4 rounded-3xl font-normal  text-sm`}
                    >
                      Monthly
                    </Link>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <Link href="/report" prefetch={true}>
                <span
                  className={`flex gap-4 items-center py-1 px-4 rounded-3xl ${
                    pathname === "/report" ? "bg-bg_orange" : ""
                  }`}
                >
                  <HiOutlineDocumentReport
                    size={20}
                    className={`${
                      pathname === "/report"
                        ? "text-white"
                        : "dark:text-white text-text_gray"
                    }`}
                  />
                  <p
                    className={` font-normal  text-sm ${
                      pathname === "/report"
                        ? "text-white"
                        : "dark:text-white text-text_gray"
                    }`}
                  >
                    Reports
                  </p>
                </span>
              </Link>
              <Link href="/tasks" prefetch={true}>
                <span
                  className={`flex gap-4 items-center py-1 px-4 rounded-3xl ${
                    pathname === "/tasks" ? "bg-bg_orange" : ""
                  }`}
                >
                  <LiaTasksSolid
                    size={20}
                    className={`${
                      pathname === "/tasks"
                        ? "text-white"
                        : "dark:text-white text-text_gray"
                    }`}
                  />
                  <p
                    className={` font-normal  text-sm ${
                      pathname === "/tasks"
                        ? "text-white"
                        : "dark:text-white text-text_gray"
                    }`}
                  >
                    Tasks
                  </p>
                </span>
              </Link>
              <Link href="/clock" prefetch={true}>
                <span
                  className={`flex gap-4 items-center py-1 px-4 rounded-3xl ${
                    pathname === "/clock" ? "bg-bg_orange" : ""
                  }`}
                >
                  <CiClock2
                    size={20}
                    className={`${
                      pathname === "/clock"
                        ? "text-white"
                        : "dark:text-white text-text_gray"
                    }`}
                  />
                  <p
                    className={`" font-normal  text-sm ${
                      pathname === "/clock"
                        ? "text-white"
                        : "dark:text-white text-text_gray"
                    }`}
                  >
                    Clock In/Out
                  </p>
                </span>
              </Link>
              <Link href="/projects" prefetch={true}>
                <span
                  className={`flex gap-4 items-center py-1 px-4 rounded-3xl ${
                    pathname === "/projects" ? "bg-bg_orange" : ""
                  }`}
                >
                  <MdOutlineEditNote
                    size={20}
                    className={`${
                      pathname === "/projects"
                        ? "text-white"
                        : "dark:text-white text-text_gray"
                    }`}
                  />
                  <p
                    className={` font-normal  text-sm ${
                      pathname === "/projects"
                        ? "text-white"
                        : "dark:text-white text-text_gray"
                    }`}
                  >
                    Projects
                  </p>
                </span>
              </Link>
              <Link href="/clients" prefetch={true}>
                <span
                  className={`flex gap-4 items-center py-1 px-4 rounded-3xl ${
                    pathname === "/clients" ? "bg-bg_orange" : ""
                  }`}
                >
                  <HiOutlineUsers
                    size={20}
                    className={`${
                      pathname === "/clients"
                        ? "text-white"
                        : "dark:text-white text-text_gray"
                    }`}
                  />
                  <p
                    className={` font-normal  text-sm ${
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
            {status === "authenticated" ? (
              <Button
                onClick={handleLogout}
                className="bg-bg_orange hover:bg-l_orange text-white w-full  h-8 self-center rounded-lg"
              >
                Sign out
              </Button>
            ) : (
              ""
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Render only icons when the collapsible sidebar is closed */}
      {!isOpen && (
        <div className="flex flex-col items-center gap-4">
          <Link href="/" prefetch={true}>
            <RxDashboard
              size={20}
              className={`${
                pathname === "/"
                  ? "text-bg_orange"
                  : "dark:text-white text-text_gray"
              }`}
            />
          </Link>
          <Link href="/live-feed" prefetch={true}>
            <BsCameraVideo
              size={20}
              className={`${
                pathname === "/live-feed"
                  ? "text-bg_orange"
                  : "dark:text-white text-text_gray"
              }`}
            />
          </Link>
          <Link href="/users" prefetch={true}>
            <HiOutlineUsers
              size={20}
              className={`${
                pathname === "/users"
                  ? "text-bg_orange"
                  : "dark:text-white text-text_gray"
              }`}
            />
          </Link>
          <Link href="/report" prefetch={true}>
            <HiOutlineDocumentReport
              size={20}
              className={`${
                pathname === "/report"
                  ? "text-bg_orange"
                  : "dark:text-white text-text_gray"
              }`}
            />
          </Link>
          {/* Add other icons similarly for Timesheets, Clock, etc. */}
        </div>
      )}
    </div>
  );
};

export default SideBar;
