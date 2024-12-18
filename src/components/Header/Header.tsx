"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

import { IoNotificationsOutline } from "react-icons/io5";
import Image from "next/image";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { Archivo, Raleway } from "next/font/google";
import { usePathname } from "next/navigation";
import { PiHandWithdraw, PiSphereLight } from "react-icons/pi";
import { Kalam } from "next/font/google";
import { Anton } from "next/font/google";
import { RxCrossCircled, RxScissors } from "react-icons/rx";
import { BsFillHouseFill } from "react-icons/bs";
import { MdFoodBank, MdOutlineSubscriptions } from "react-icons/md";
import { Button } from "../ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import { ModeToggle } from "../ThemeToggle/ThemeToggle";
import {
  ArrowLeftRight,
  Bell,
  CalendarRange,
  Database,
  FileCheck,
  Handshake,
  IdCard,
  LayoutDashboard,
  Network,
  NotebookPen,
  Users,
  Wallet,
} from "lucide-react";

const archivo = Archivo({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

const raleway = Raleway({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const anton = Anton({
  weight: ["400"],
  subsets: ["latin"],
});

const Header = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [accordionValue, setAccordionValue] = useState<string | undefined>(
    undefined
  );

  const handleLogout = () => {
    signOut();
  };

  const handleLogin = () => {
    signIn();
  };

  useEffect(() => {
    // Map pathname to specific accordion items
    switch (pathname) {
      case "/overall-transaction/total-billing":
      case "/overall-transaction/total-business":
        setAccordionValue("item-1");
        break;
      case "/meta/business-type":
      case "/meta/company-info":
      case "/meta/continent":
      case "/meta/country":
      case "/meta/currency":
      case "/meta/faqs":
      case "/meta/privacy-policy":
      case "/meta/terms-and-conditions":
        setAccordionValue("item-2");
        break;
      case "/event/event-create":
      case "/event/event-fee":
      case "/event/event-book":
        setAccordionValue("item-3");
        break;
      case "/membership/membership":
      case "/membership/membership-type":
      case "/membership/project-discount":
      case "/membership/type-discount":
        setAccordionValue("item-4");
        break;
      case "/referral/referral":
      case "/referral/business-referral":
        setAccordionValue("item-5");
        break;
      case "/wallet/transaction":
      case "/wallet/user-wallet":
        setAccordionValue("item-6");
        break;
      default:
        setAccordionValue(undefined);
    }
  }, [pathname]);

  return (
    <header className="w-full bg-white dark:bg-secondary_dark h-14 text-white flex items-center justify-between sm:px-8 px-2 py-4 pr-4 gap-2">
      <div className="flex gap-2 items-center">
        {/*Sheet*/}
        <div className="lg:hidden block place-self-end sm:p-4 overflow-y-auto">
          <Sheet>
            <SheetTrigger className="pt-2">
              <RiMenuLine
                className="text-primary_text dark:text-sidebar_blue"
                size={25}
              />
            </SheetTrigger>
            <SheetContent className="dark:bg-primary_dark bg-white h-full overflow-y-auto">
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
                      prefetch={true}
                      className="w-full flex justify-start gap-1 px-4 pb-3 border-b border-b-vl_gray"
                    >
                      <PiSphereLight
                        size={25}
                        className=" text-primary_text dark:text-sidebar_blue"
                      />
                      <h2
                        className={`${anton.className} font-medium text-lg text-primary_text dark:text-sidebar_blue`}
                      >
                        MoreClub
                      </h2>
                    </Link>
                  </SheetClose>
                </SheetTitle>
                <SheetDescription>
                  <div
                    className={`flex flex-col gap-2 py-4  ${raleway.className} font-medium text-[13px]`}
                  >
                    <SheetClose asChild>
                      <Link href="/" prefetch={true}>
                        <span
                          className={`flex gap-2 items-center py-2 pb-1 px-2 rounded-md ${
                            pathname === "/"
                              ? "bg-primary_text text-white"
                              : "dark:text-white text-charcoal"
                          }`}
                        >
                          <LayoutDashboard size={18} />
                          <p>Dashboard</p>
                        </span>
                      </Link>
                    </SheetClose>

                    <SheetClose asChild>
                      <Link href="/users" prefetch={true}>
                        <span
                          className={`flex gap-2 items-center py-2 pb-1 px-2 rounded-md ${
                            pathname === "/users"
                              ? "bg-primary_text text-white"
                              : "dark:text-white text-charcoal"
                          }`}
                        >
                          <Users size={18} />
                          <p
                            className={` 
                              `}
                          >
                            User
                          </p>
                        </span>
                      </Link>
                    </SheetClose>

                    <SheetClose asChild>
                      <Link href="/station" prefetch={true}>
                        <span
                          className={`flex gap-2 items-center py-2 pb-1 px-2 rounded-md ${
                            pathname === "/station"
                              ? "bg-primary_text text-white"
                              : "dark:text-white text-charcoal"
                          }`}
                        >
                          <BsFillHouseFill size={18} />
                          <p
                            className={` 
                              `}
                          >
                            Station
                          </p>
                        </span>
                      </Link>
                    </SheetClose>

                    <SheetClose asChild>
                      <Link href="/restaurant" prefetch={true}>
                        <span
                          className={`flex gap-2 items-center py-2 pb-1 px-2 pl-1 rounded-md ${
                            pathname === "/restaurant"
                              ? "bg-primary_text text-white"
                              : "dark:text-white text-charcoal"
                          }`}
                        >
                          <MdFoodBank size={23} />
                          <p
                            className={` 
                              `}
                          >
                            Restaurant
                          </p>
                        </span>
                      </Link>
                    </SheetClose>

                    <SheetClose asChild>
                      <Link href="/salon" prefetch={true}>
                        <span
                          className={`flex gap-2 items-center py-2 pb-1 px-2 pl-2 rounded-md ${
                            pathname === "/salon"
                              ? "bg-primary_text text-white"
                              : "dark:text-white text-charcoal"
                          }`}
                        >
                          <RxScissors size={19} />
                          <p
                            className={` 
                              `}
                          >
                            Salon
                          </p>
                        </span>
                      </Link>
                    </SheetClose>

                    <Accordion
                      type="single"
                      collapsible
                      value={accordionValue}
                      onValueChange={setAccordionValue}
                      className="flex flex-col gap-2"
                    >
                      <AccordionItem value="item-1">
                        <AccordionTrigger
                          className={`py-2 pb-1 px-2 rounded-md `}
                        >
                          <span
                            className={`flex gap-2 items-center dark:text-white text-charcoal`}
                          >
                            <ArrowLeftRight size={18} />
                            <p>Overall Transaction</p>
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="flex flex-col pl-3 font-medium text-[13px]">
                          <SheetClose asChild>
                            <Link
                              href={"/overall-transaction/total-billing"}
                              prefetch={true}
                              className={`${
                                pathname ===
                                "/overall-transaction/total-billing"
                                  ? "bg-primary_text text-white"
                                  : "dark:text-white text-charcoal"
                              } py-2 pb-1 px-2 rounded-md flex justify-start`}
                            >
                              Total Billing
                            </Link>
                          </SheetClose>
                          <SheetClose asChild>
                            <Link
                              href={"/overall-transaction/total-business"}
                              prefetch={true}
                              className={`${
                                pathname ===
                                "/overall-transaction/total-business"
                                  ? "bg-primary_text text-white"
                                  : "dark:text-white text-charcoal"
                              } py-2 pb-1 px-2 rounded-md flex justify-start`}
                            >
                              Total Business
                            </Link>
                          </SheetClose>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-2">
                        <AccordionTrigger
                          className={`py-2 pb-1 px-2 rounded-md 
                           `}
                        >
                          <span
                            className={`flex gap-[6px] items-center dark:text-white text-charcoal`}
                          >
                            <Database size={20} />
                            <p>Meta</p>
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="flex flex-col pl-3 text-[13px] font-medium">
                          <SheetClose asChild>
                            <Link href="/meta/business-type" prefetch={true}>
                              <span
                                className={`flex gap-2 items-center py-2 pb-1 px-2 rounded-md ${
                                  pathname === "/meta/business-type"
                                    ? "bg-primary_text text-white"
                                    : "dark:text-white text-charcoal"
                                }`}
                              >
                                <p>Business Type</p>
                              </span>
                            </Link>
                          </SheetClose>
                          <SheetClose asChild>
                            <Link href="/meta/company-info" prefetch={true}>
                              <span
                                className={`flex gap-2 items-center py-2 pb-1 px-2 rounded-md ${
                                  pathname === "/meta/company-info"
                                    ? "bg-primary_text text-white"
                                    : "dark:text-white text-charcoal"
                                }`}
                              >
                                <p>Company Information</p>
                              </span>
                            </Link>
                          </SheetClose>

                          <SheetClose asChild>
                            <Link href="/meta/continent" prefetch={true}>
                              <span
                                className={`flex gap-2 items-center py-2 pb-1 px-2 rounded-md ${
                                  pathname === "/meta/continent"
                                    ? "bg-primary_text text-white"
                                    : "dark:text-white text-charcoal"
                                }`}
                              >
                                <p
                                  className={` 
                              `}
                                >
                                  Continent
                                </p>
                              </span>
                            </Link>
                          </SheetClose>

                          <SheetClose asChild>
                            <Link href="/meta/country" prefetch={true}>
                              <span
                                className={`flex gap-2 items-center py-2 pb-1 px-2 rounded-md ${
                                  pathname === "/meta/country"
                                    ? "bg-primary_text text-white"
                                    : "dark:text-white text-charcoal"
                                }`}
                              >
                                <p
                                  className={` 
                              `}
                                >
                                  Country
                                </p>
                              </span>
                            </Link>
                          </SheetClose>

                          <SheetClose asChild>
                            <Link href="/meta/currency" prefetch={true}>
                              <span
                                className={`flex gap-2 items-center py-2 pb-1 px-2 rounded-md ${
                                  pathname === "/meta/currency"
                                    ? "bg-primary_text text-white"
                                    : "dark:text-white text-charcoal"
                                }`}
                              >
                                <p
                                  className={` 
                              `}
                                >
                                  Currency
                                </p>
                              </span>
                            </Link>
                          </SheetClose>

                          <SheetClose asChild>
                            <Link href="/meta/faqs" prefetch={true}>
                              <span
                                className={`flex gap-2 items-center py-2 pb-1 px-2 rounded-md ${
                                  pathname === "/meta/faqs"
                                    ? "bg-primary_text text-white"
                                    : "dark:text-white text-charcoal"
                                }`}
                              >
                                <p
                                  className={` 
                              `}
                                >
                                  FAQs
                                </p>
                              </span>
                            </Link>
                          </SheetClose>

                          <SheetClose asChild>
                            <Link href="/meta/privacy-policy" prefetch={true}>
                              <span
                                className={`flex gap-2 items-center py-2 pb-1 px-2 rounded-md ${
                                  pathname === "/meta/privacy-policy"
                                    ? "bg-primary_text text-white"
                                    : "dark:text-white text-charcoal"
                                }`}
                              >
                                <p
                                  className={` 
                              `}
                                >
                                  Privacy Policy
                                </p>
                              </span>
                            </Link>
                          </SheetClose>

                          <SheetClose asChild>
                            <Link
                              href="/meta/terms-and-conditions"
                              prefetch={true}
                            >
                              <span
                                className={`flex gap-2 items-center py-2 pb-1 px-2 rounded-md ${
                                  pathname === "/meta/terms-and-conditions"
                                    ? "bg-primary_text text-white"
                                    : "dark:text-white text-charcoal"
                                }`}
                              >
                                <p
                                  className={` 
                              `}
                                >
                                  Terms and Conditions
                                </p>
                              </span>
                            </Link>
                          </SheetClose>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-3">
                        <AccordionTrigger
                          className={`py-2 pb-1 px-2 rounded-md `}
                        >
                          <span
                            className={`flex gap-[6px] items-center dark:text-white text-charcoal`}
                          >
                            <CalendarRange size={20} />
                            <p>Event</p>
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="flex flex-col pl-3 font-medium text-[13px]">
                          <SheetClose asChild>
                            <Link href="/event/event-create" prefetch={true}>
                              <span
                                className={`flex gap-2 items-center py-2 pb-1 px-2 rounded-md ${
                                  pathname === "/event/event-create"
                                    ? "bg-primary_text text-white"
                                    : "dark:text-white text-charcoal"
                                }`}
                              >
                                <p
                                  className={` 
                              `}
                                >
                                  Event Create
                                </p>
                              </span>
                            </Link>
                          </SheetClose>

                          <SheetClose asChild>
                            <Link href="/event/event-fee" prefetch={true}>
                              <span
                                className={`flex gap-2 items-center py-2 pb-1 px-2 rounded-md ${
                                  pathname === "/event/event-fee"
                                    ? "bg-primary_text text-white"
                                    : "dark:text-white text-charcoal"
                                }`}
                              >
                                <p
                                  className={` 
                              `}
                                >
                                  Event Fee
                                </p>
                              </span>
                            </Link>
                          </SheetClose>

                          <SheetClose asChild>
                            <Link href="/event/event-book" prefetch={true}>
                              <span
                                className={`flex gap-2 items-center py-2 pb-1 px-2 rounded-md ${
                                  pathname === "/event/event-book"
                                    ? "bg-primary_text text-white"
                                    : "dark:text-white text-charcoal"
                                }`}
                              >
                                <p
                                  className={` 
                              `}
                                >
                                  Event Book
                                </p>
                              </span>
                            </Link>
                          </SheetClose>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-4">
                        <AccordionTrigger
                          className={`py-2 pb-1 px-2 rounded-md `}
                        >
                          <span
                            className={`flex gap-2 items-center dark:text-white text-charcoal `}
                          >
                            <IdCard size={18} />
                            <p>Membership</p>
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="flex flex-col pl-3 font-medium text-[13px]">
                          <SheetClose asChild>
                            <Link
                              href={"/membership/membership"}
                              prefetch={true}
                              className={`${
                                pathname === "/membership/membership"
                                  ? "bg-primary_text text-white"
                                  : "dark:text-white text-charcoal"
                              } py-2 pb-1 px-2 rounded-md flex justify-start`}
                            >
                              Membership
                            </Link>
                          </SheetClose>
                          <SheetClose asChild>
                            <Link
                              href={"/membership/membership-type"}
                              prefetch={true}
                              className={`${
                                pathname === "/membership/membership-type"
                                  ? "bg-primary_text text-white"
                                  : "dark:text-white text-charcoal"
                              } py-2 pb-1 px-2 rounded-md flex justify-start`}
                            >
                              Membership Type
                            </Link>
                          </SheetClose>
                          <SheetClose asChild>
                            <Link
                              href={"/membership/project-discount"}
                              prefetch={true}
                              className={`${
                                pathname === "/membership/project-discount"
                                  ? "bg-primary_text text-white"
                                  : "dark:text-white text-charcoal"
                              } py-2 pb-1 px-2 rounded-md flex justify-start`}
                            >
                              Project Discount
                            </Link>
                          </SheetClose>
                          <SheetClose asChild>
                            <Link
                              href={"/membership/type-discount"}
                              prefetch={true}
                              className={`${
                                pathname === "/membership/type-discount"
                                  ? "bg-primary_text text-white"
                                  : "dark:text-white text-charcoal"
                              } py-2 pb-1 px-2 rounded-md flex justify-start`}
                            >
                              Type Discount
                            </Link>
                          </SheetClose>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-5">
                        <AccordionTrigger
                          className={`py-2 pb-1 px-2 rounded-md `}
                        >
                          <span
                            className={`flex gap-2 items-center dark:text-white text-charcoal `}
                          >
                            <Network size={18} />
                            <p>Referral</p>
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="flex flex-col pl-3 font-medium text-[13px]">
                          <SheetClose asChild>
                            <Link
                              href={"/referral/referral"}
                              prefetch={true}
                              className={`${
                                pathname === "/referral/referral"
                                  ? "bg-primary_text text-white"
                                  : "dark:text-white text-charcoal"
                              } py-2 pb-1 px-2 rounded-md flex justify-start`}
                            >
                              Referral
                            </Link>
                          </SheetClose>
                          <SheetClose asChild>
                            <Link
                              href={"/referral/business-referral"}
                              prefetch={true}
                              className={`${
                                pathname === "/referral/business-referral"
                                  ? "bg-primary_text text-white"
                                  : "dark:text-white text-charcoal"
                              } py-2 pb-1 px-2 rounded-md flex justify-start`}
                            >
                              Business Referral
                            </Link>
                          </SheetClose>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-6">
                        <AccordionTrigger
                          className={`py-2 pb-1 px-2 rounded-md `}
                        >
                          <span
                            className={`flex gap-2 items-center dark:text-white text-charcoal `}
                          >
                            <Wallet size={18} />
                            <p>Wallet</p>
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="flex flex-col pl-3 font-medium text-[13px]">
                          <SheetClose asChild>
                            <Link href="/wallet/transaction" prefetch={true}>
                              <span
                                className={`flex gap-2 items-center py-2 pb-1 px-2 rounded-md ${
                                  pathname === "/wallet/transaction"
                                    ? "bg-primary_text text-white"
                                    : "dark:text-white text-charcoal"
                                }`}
                              >
                                <p>Transaction</p>
                              </span>
                            </Link>
                          </SheetClose>
                          <SheetClose asChild>
                            <Link href="/wallet/user-wallet" prefetch={true}>
                              <span
                                className={`flex gap-2 items-center py-2 pb-1 px-2 rounded-md ${
                                  pathname === "/wallet/user-wallet"
                                    ? "bg-primary_text text-white"
                                    : "dark:text-white text-charcoal"
                                }`}
                              >
                                <p>User Wallet</p>
                              </span>
                            </Link>
                          </SheetClose>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>

                    <SheetClose asChild>
                      <Link href="/kyc" prefetch={true}>
                        <span
                          className={`flex gap-2 items-center py-2 pb-1 px-2 rounded-md ${
                            pathname === "/kyc"
                              ? "bg-primary_text text-white"
                              : "dark:text-white text-charcoal"
                          }`}
                        >
                          <FileCheck size={18} />
                          <p
                            className={` 
                              `}
                          >
                            KYC
                          </p>
                        </span>
                      </Link>
                    </SheetClose>

                    <SheetClose asChild>
                      <Link href="/notification" prefetch={true}>
                        <span
                          className={`flex gap-2 items-center py-2 pb-1 px-2 pl-[6px] rounded-md ${
                            pathname === "/notification"
                              ? "bg-primary_text text-white"
                              : "dark:text-white text-charcoal"
                          }`}
                        >
                          <Bell size={21} />
                          <p>Notification</p>
                        </span>
                      </Link>
                    </SheetClose>

                    <SheetClose asChild>
                      <Link href="/partners" prefetch={true}>
                        <span
                          className={`flex gap-2 items-center py-2 pb-1 px-2 rounded-md ${
                            pathname === "/partners"
                              ? "bg-primary_text text-white"
                              : "dark:text-white text-charcoal"
                          }`}
                        >
                          <Handshake size={18} />
                          <p>Partners</p>
                        </span>
                      </Link>
                    </SheetClose>

                    <SheetClose asChild>
                      <Link href="/project" prefetch={true}>
                        <span
                          className={`flex gap-2 items-center py-2 pb-1 px-2 rounded-md ${
                            pathname === "/project"
                              ? "bg-primary_text text-white"
                              : "dark:text-white text-charcoal"
                          }`}
                        >
                          <NotebookPen size={18} />
                          <p>Project</p>
                        </span>
                      </Link>
                    </SheetClose>

                    <SheetClose asChild>
                      <Link href="/subscription" prefetch={true}>
                        <span
                          className={`flex gap-2 items-center py-2 pb-1 px-2 rounded-md ${
                            pathname === "/subscription"
                              ? "bg-primary_text text-white"
                              : "dark:text-white text-charcoal"
                          }`}
                        >
                          <MdOutlineSubscriptions size={18} />
                          <p>Subscription</p>
                        </span>
                      </Link>
                    </SheetClose>

                    <SheetClose asChild>
                      <Link href="/withdraw" prefetch={true}>
                        <span
                          className={`flex gap-2 items-center py-2 pb-1 px-2 rounded-md ${
                            pathname === "/withdraw"
                              ? "bg-primary_text text-white"
                              : "dark:text-white text-charcoal"
                          }`}
                        >
                          <PiHandWithdraw size={18} />
                          <p>Withdraw</p>
                        </span>
                      </Link>
                    </SheetClose>
                  </div>

                  <SheetClose asChild>
                    {status === "authenticated" ? (
                      <Button
                        onClick={handleLogout}
                        className="bg-primary_text hover:bg-l_orange dark:bg-sidebar_blue dark:hover:opacity-65 text-white w-full sm:h-12 h-8 self-center rounded-lg"
                      >
                        Sign out
                      </Button>
                    ) : (
                      ""
                    )}
                  </SheetClose>
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>

        <div className="sm:block hidden relative md:w-80 sm:w-40 w-24">
          <TbSearch className="absolute top-1/2 sm:left-3 left-1 transform -translate-y-1/2 dark:text-white text-black" />
          <Input
            className="w-full sm:pl-10 pl-6 bg-white dark:bg-secondary_dark border dark:border-gray rounded-md focus:ring-0 dark:text-white text-black"
            placeholder="Search"
          />
        </div>
        <div className="sm:hidden block">
          <TbSearch className=" dark:text-white text-black" size={25} />
        </div>
      </div>
      <div className="flex items-center justify-center sm:gap-3 gap-2">
        <div className="flex sam:gap-3 gap-2">
          <ModeToggle />
          <Button
            variant="outline"
            size="icon"
            className="rounded-full dark:bg-blue bg-vl_blue sm:w-10 sm:h-10 w-8 h-8"
          >
            <IoNotificationsOutline
              size={23}
              className="dark:text-white text-black"
            />
          </Button>
        </div>
        {status === "authenticated" ? (
          <div className="flex sm:gap-1 items-center">
            <Image
              src={"/images/girl.jpeg"}
              alt="profile"
              width={100}
              height={100}
              className="rounded-full sm:w-12 w-8 h-8 sm:h-12 border-2 border-white"
            />
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1" className="relative">
                <AccordionTrigger className="text-black dark:text-white">
                  <p className="dark:text-white text-black font-medium sm:text-base text-sm sm:block hidden">
                    Angela
                  </p>
                </AccordionTrigger>
                <AccordionContent className="flex flex-col justify-start bg-white dark:bg-secondary_dark h-16 p-3 absolute top-10 right-2 rounded-sm shadow-md z-40">
                  <Button
                    onClick={handleLogout}
                    className="bg-primary_text dark:bg-sidebar_blue hover:bg-l_orange dark:hover:bg-blue text-white w-full  h-8 mb-6 self-center rounded-lg"
                  >
                    Sign out
                  </Button>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        ) : (
          <Button
            onClick={handleLogin}
            className="bg-primary_text dark:bg-sidebar_blue hover:bg-l_orange text-white w-full h-9 self-center rounded-lg"
          >
            Sign in
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
