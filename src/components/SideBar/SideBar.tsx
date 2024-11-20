"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Open_Sans } from "next/font/google";
import { usePathname } from "next/navigation";
import {
  PiHandWithdraw,
  PiNetwork,
  PiNetworkFill,
  PiSphereLight,
} from "react-icons/pi";
import { Anton } from "next/font/google";
import { RxDashboard } from "react-icons/rx";
import {
  BsDoorClosed,
  BsFileEarmarkLock2,
  BsFillBriefcaseFill,
  BsFillHouseFill,
  BsFlagFill,
} from "react-icons/bs";
import { HiCurrencyDollar } from "react-icons/hi";
import { GrDocumentVerified, GrTransaction } from "react-icons/gr";
import {
  MdDiscount,
  MdOutlineDiscount,
  MdOutlineEditNote,
  MdFoodBank,
  MdOutlineSubscriptions,
} from "react-icons/md";
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
import { IoIosNotifications } from "react-icons/io";
import {
  IoCalendarSharp,
  IoWalletOutline,
  IoWalletSharp,
} from "react-icons/io5";
import {
  FaAddressCard,
  FaBusinessTime,
  FaHandshake,
  FaIdCard,
  FaMoneyBillTransfer,
  FaUserGroup,
} from "react-icons/fa6";
import { AiFillInfoCircle } from "react-icons/ai";
import { HiOutlineClipboardDocumentCheck } from "react-icons/hi2";
import {
  TbCalendarCheck,
  TbCalendarDollar,
  TbCalendarPlus,
} from "react-icons/tb";
import { FaGlobeAmericas } from "react-icons/fa";
import { RiBillFill, RiQuestionnaireFill } from "react-icons/ri";
import { ImDatabase } from "react-icons/im";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { toggleSidebar } from "@/lib/store/features/Collapsible/CollapsibleSlice";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const anton = Anton({
  weight: ["400"],
  subsets: ["latin"],
});

const open_sans = Open_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const SideBar = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  // const [isOpen, setIsOpen] = React.useState(true);
  const [accordionValue, setAccordionValue] = useState<string | undefined>(
    undefined
  );

  const dispatch = useAppDispatch();

  // Access collapse state from Redux
  const isOpen = useAppSelector((state) => state.collapsible.collapse);

  // Function to handle toggle
  const handleToggle = () => {
    dispatch(toggleSidebar(!isOpen)); // Toggles the sidebar open/closed
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

  const handleLogout = () => {
    signOut();
  };

  return (
    <ScrollArea className="bg-white dark:bg-grayy lg:flex flex-col hidden gap-2 h-screen p-2">
      <Collapsible open={isOpen} onOpenChange={handleToggle}>
        <CollapsibleTrigger className="collapsible-trigger flex items-center w-full">
          {isOpen ? (
            <div className="flex items-center justify-center  w-full xl:px-4">
              <Link
                href={"/"}
                prefetch={true}
                className="w-full flex gap-2 py-4 px-3 xl:pb-4 pb-3 "
              >
                <PiSphereLight
                  size={25}
                  className="text-primary_text dark:text-secondary_text"
                />
                <h2
                  className={`${anton.className} font-medium xl:text-xl text-lg text-primary_text dark:text-secondary_text`}
                >
                  MoreClub
                </h2>
              </Link>
              <div className="flex items-center justify-center">
                <BsDoorClosed size={30} className="pb-1" />
              </div>
            </div>
          ) : (
            <div className="py-4 px-2">
              <BsDoorOpenFill size={25} />
            </div>
          )}
        </CollapsibleTrigger>

        <CollapsibleContent
          className={`collapsible-content ${isOpen ? "open" : ""}`}
        >
          <div
            className={`flex flex-col gap-4 xl:px-4 py-2 ${open_sans.className}`}
          >
            <div className="flex flex-col gap-1">
              <Link
                href="/"
                prefetch={true}
                className={`flex gap-3 items-center py-3 pb-1 px-4 rounded-md ${
                  pathname === "/"
                    ? "bg-primary_text dark:bg-secondary_text text-white"
                    : "dark:text-white text-text_gray hover:bg-shadow_gray dark:hover:bg-vl_gray"
                }`}
              >
                <RxDashboard size={20} />
                <p className={` font-normal  text-sm`}>Dashboard</p>
              </Link>
              <Link
                href="/users"
                prefetch={true}
                className={`flex gap-3 items-center py-3 pb-1 px-4 rounded-md ${
                  pathname === "/users"
                    ? "bg-primary_text dark:bg-secondary_text text-white"
                    : "dark:text-white text-text_gray hover:bg-shadow_gray dark:hover:bg-vl_gray"
                }`}
              >
                <FaUserGroup size={20} />
                <p className={` font-normal  text-sm `}>User</p>
              </Link>
              <Link
                href="/station"
                prefetch={true}
                className={`flex gap-3 items-center py-3 pb-1 px-4 rounded-md ${
                  pathname === "/station"
                    ? "bg-primary_text dark:bg-secondary_text text-white"
                    : "dark:text-white text-text_gray hover:bg-shadow_gray dark:hover:bg-vl_gray"
                }`}
              >
                <BsFillHouseFill size={20} />
                <p className={` font-normal  text-sm`}>Station</p>
              </Link>

              {/* <Link
                href="/restaurant"
                prefetch={true}
                className={`flex gap-[11px] items-center pt-2 pb-[2px] pl-3 px-4 rounded-md ${
                  pathname === "/restaurant"
                    ? "bg-primary_text dark:bg-secondary_text text-white"
                    : "dark:text-white text-text_gray hover:bg-shadow_gray dark:hover:bg-vl_gray"
                }`}
              >
                <MdFoodBank size={25} />
                <p className={` font-normal  text-sm`}>Restaurant</p>
              </Link> */}

              <Accordion
                type="single"
                collapsible
                value={accordionValue}
                onValueChange={setAccordionValue}
                className="flex flex-col gap-1"
              >
                <AccordionItem value="item-1">
                  <AccordionTrigger
                    className={`py-3 pb-1 px-4 rounded-md hover:bg-shadow_gray dark:hover:bg-vl_gray`}
                  >
                    <span
                      className={`flex gap-3 items-center dark:text-white text-text_gray`}
                    >
                      <FaMoneyBillTransfer size={20} />
                      <p className={` font-normal  text-sm `}>
                        Overall Transaction
                      </p>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col pt-2 sm:pl-6 gap-1">
                    <Link
                      href={"/overall-transaction/total-billing"}
                      prefetch={true}
                      className={`${
                        pathname === "/overall-transaction/total-billing"
                          ? "bg-primary_text dark:bg-secondary_text text-white"
                          : "dark:text-white text-text_gray hover:bg-shadow_gray dark:hover:bg-vl_gray"
                      } py-1 px-4 rounded-md font-normal  text-sm`}
                    >
                      Total Billing
                    </Link>
                    <Link
                      href={"/overall-transaction/total-business"}
                      prefetch={true}
                      className={`${
                        pathname === "/overall-transaction/total-business"
                          ? "bg-primary_text dark:bg-secondary_text text-white"
                          : "dark:text-white text-text_gray hover:bg-shadow_gray dark:hover:bg-vl_gray"
                      } py-1 px-4 rounded-md font-normal  text-sm`}
                    >
                      Total Business
                    </Link>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger
                    className={`py-3 pb-1 px-4 rounded-md hover:bg-shadow_gray dark:hover:bg-vl_gray`}
                  >
                    <span
                      className={`flex gap-[14px] items-center dark:text-white text-text_gray`}
                    >
                      <ImDatabase size={18} />
                      <p className={` font-normal  text-sm `}>Meta</p>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col pt-2 sm:pl-6 gap-2">
                    <Link
                      href={"/meta/business-type"}
                      prefetch={true}
                      className={`flex gap-2 items-center py-1 px-2 rounded-md ${
                        pathname === "/meta/business-type"
                          ? "bg-primary_text dark:bg-secondary_text text-white"
                          : "dark:text-white text-text_gray hover:bg-shadow_gray dark:hover:bg-vl_gray"
                      }`}
                    >
                      <BsFillBriefcaseFill size={19} />
                      <p className={` font-normal  text-sm`}>Business Type</p>
                    </Link>

                    <Link
                      href={"/meta/company-info"}
                      prefetch={true}
                      className={`flex gap-2 items-center py-1 px-2 rounded-md ${
                        pathname === "/meta/company-info"
                          ? "bg-primary_text dark:bg-secondary_text text-white"
                          : "dark:text-white text-text_gray hover:bg-shadow_gray dark:hover:bg-vl_gray"
                      }`}
                    >
                      <AiFillInfoCircle size={20} />
                      <p className={` font-normal  text-sm`}>
                        Company Information
                      </p>
                    </Link>

                    <Link
                      href={"/meta/continent"}
                      prefetch={true}
                      className={`flex gap-2 items-center py-1 px-2 rounded-md ${
                        pathname === "/meta/continent"
                          ? "bg-primary_text dark:bg-secondary_text text-white"
                          : "dark:text-white text-text_gray hover:bg-shadow_gray dark:hover:bg-vl_gray"
                      }`}
                    >
                      <FaGlobeAmericas size={20} />
                      <p className={` font-normal  text-sm`}>Continent</p>
                    </Link>

                    <Link
                      href={"/meta/country"}
                      prefetch={true}
                      className={`flex gap-2 items-center py-1 px-2 rounded-md ${
                        pathname === "/meta/country"
                          ? "bg-primary_text dark:bg-secondary_text text-white"
                          : "dark:text-white text-text_gray hover:bg-shadow_gray dark:hover:bg-vl_gray"
                      }`}
                    >
                      <BsFlagFill size={20} />
                      <p className={` font-normal  text-sm`}>Country</p>
                    </Link>
                    <Link
                      href={"/meta/currency"}
                      prefetch={true}
                      className={`flex gap-2 items-center py-1 px-2 rounded-md ${
                        pathname === "/meta/currency"
                          ? "bg-primary_text dark:bg-secondary_text text-white"
                          : "dark:text-white text-text_gray hover:bg-shadow_gray dark:hover:bg-vl_gray"
                      }`}
                    >
                      <HiCurrencyDollar size={20} />
                      <p className={` font-normal  text-sm`}>Currency</p>
                    </Link>

                    <Link
                      href={"/meta/faqs"}
                      prefetch={true}
                      className={`flex gap-2 items-center py-1 px-2 rounded-md ${
                        pathname === "/meta/faqs"
                          ? "bg-primary_text dark:bg-secondary_text text-white"
                          : "dark:text-white text-text_gray hover:bg-shadow_gray dark:hover:bg-vl_gray"
                      }`}
                    >
                      <RiQuestionnaireFill size={20} />
                      <p className={` font-normal  text-sm`}>FAQs</p>
                    </Link>

                    <Link
                      href={"/meta/privacy-policy"}
                      prefetch={true}
                      className={`flex gap-2 items-center py-1 px-2 rounded-md ${
                        pathname === "/meta/privacy-policy"
                          ? "bg-primary_text dark:bg-secondary_text text-white"
                          : "dark:text-white text-text_gray hover:bg-shadow_gray dark:hover:bg-vl_gray"
                      }`}
                    >
                      <BsFileEarmarkLock2 size={20} />
                      <p className={` font-normal  text-sm`}>Privacy Policy</p>
                    </Link>

                    <Link
                      href={"/meta/terms-and-conditions"}
                      prefetch={true}
                      className={`flex gap-2 items-center py-1 px-2 rounded-md ${
                        pathname === "/meta/terms-and-conditions"
                          ? "bg-primary_text dark:bg-secondary_text text-white"
                          : "dark:text-white text-text_gray hover:bg-shadow_gray dark:hover:bg-vl_gray"
                      }`}
                    >
                      <HiOutlineClipboardDocumentCheck size={20} />
                      <p className={` font-normal  text-sm`}>
                        Terms and Conditions
                      </p>
                    </Link>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger
                    className={`py-3 pb-1 px-4 rounded-md hover:bg-shadow_gray dark:hover:bg-vl_gray`}
                  >
                    <span
                      className={`flex gap-3 items-center dark:text-white text-text_gray`}
                    >
                      <IoCalendarSharp size={20} />
                      <p className={` font-normal  text-sm `}>Event</p>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col pt-2 sm:pl-6 gap-2">
                    <Link
                      href={"/event/event-create"}
                      prefetch={true}
                      className={`flex gap-3 items-center py-1 px-4 rounded-md ${
                        pathname === "/event/event-create"
                          ? "bg-primary_text dark:bg-secondary_text text-white"
                          : "dark:text-white text-text_gray hover:bg-shadow_gray dark:hover:bg-vl_gray"
                      }`}
                    >
                      <TbCalendarPlus size={20} />
                      <p className="font-normal text-sm"> Event Create</p>
                    </Link>

                    <Link
                      href={"/event/event-fee"}
                      prefetch={true}
                      className={`flex gap-3 items-center py-1 px-4 rounded-md ${
                        pathname === "/event/event-fee"
                          ? "bg-primary_text dark:bg-secondary_text text-white"
                          : "dark:text-white text-text_gray hover:bg-shadow_gray dark:hover:bg-vl_gray"
                      }`}
                    >
                      <TbCalendarDollar size={20} />
                      <p className={` font-normal  text-sm `}>Event Fee</p>
                    </Link>

                    <Link
                      href={"/event/event-book"}
                      prefetch={true}
                      className={`flex gap-3 items-center py-1 px-4 rounded-md ${
                        pathname === "/event/event-book"
                          ? "bg-primary_text dark:bg-secondary_text text-white"
                          : "dark:text-white text-text_gray hover:bg-shadow_gray dark:hover:bg-vl_gray"
                      }`}
                    >
                      <TbCalendarCheck size={20} />
                      <p className={` font-normal  text-sm `}>Event Book</p>
                    </Link>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger
                    className={`py-3 pb-1 px-4 rounded-md hover:bg-shadow_gray dark:hover:bg-vl_gray`}
                  >
                    <span
                      className={`flex gap-3 items-center dark:text-white text-text_gray`}
                    >
                      <FaAddressCard size={20} />
                      <p className={` font-normal  text-sm`}>Membership</p>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col pt-2 sm:pl-6 gap-2">
                    <Link
                      href={"/membership/membership"}
                      prefetch={true}
                      className={`${
                        pathname === "/membership/membership"
                          ? "bg-primary_text dark:bg-secondary_text text-white"
                          : "dark:text-white text-text_gray hover:bg-shadow_gray dark:hover:bg-vl_gray"
                      } py-1 px-4 rounded-md font-normal  text-sm`}
                    >
                      Membership
                    </Link>
                    <Link
                      href={"/membership/membership-type"}
                      prefetch={true}
                      className={`${
                        pathname === "/membership/membership-type"
                          ? "bg-primary_text dark:bg-secondary_text text-white"
                          : "dark:text-white text-text_gray hover:bg-shadow_gray dark:hover:bg-vl_gray"
                      } py-1 px-4 rounded-md font-normal  text-sm`}
                    >
                      Membership Type
                    </Link>
                    <Link
                      href={"/membership/project-discount"}
                      prefetch={true}
                      className={`${
                        pathname === "/membership/project-discount"
                          ? "bg-primary_text dark:bg-secondary_text text-white"
                          : "dark:text-white text-text_gray hover:bg-shadow_gray dark:hover:bg-vl_gray"
                      } py-1 px-4 rounded-md font-normal  text-sm`}
                    >
                      Project Discount
                    </Link>
                    <Link
                      href={"/membership/type-discount"}
                      prefetch={true}
                      className={`${
                        pathname === "/membership/type-discount"
                          ? "bg-primary_text dark:bg-secondary_text text-white"
                          : "dark:text-white text-text_gray hover:bg-shadow_gray dark:hover:bg-vl_gray"
                      } py-1 px-4 rounded-md font-normal  text-sm`}
                    >
                      Type Discount
                    </Link>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger
                    className={`py-3 pb-1 px-4 rounded-md hover:bg-shadow_gray dark:hover:bg-vl_gray`}
                  >
                    <span
                      className={`flex gap-3 items-center dark:text-white text-text_gray`}
                    >
                      <PiNetworkFill size={20} />
                      <p className={` font-normal  text-sm`}>Referral</p>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col pt-2 sm:pl-6 gap-2">
                    <Link
                      href={"/referral/referral"}
                      prefetch={true}
                      className={`${
                        pathname === "/referral/referral"
                          ? "bg-primary_text dark:bg-secondary_text text-white"
                          : "dark:text-white text-text_gray hover:bg-shadow_gray dark:hover:bg-vl_gray"
                      } py-1 px-4 rounded-md font-normal  text-sm`}
                    >
                      Referral
                    </Link>
                    <Link
                      href={"/referral/business-referral"}
                      prefetch={true}
                      className={`${
                        pathname === "/referral/business-referral"
                          ? "bg-primary_text dark:bg-secondary_text text-white"
                          : "dark:text-white text-text_gray hover:bg-shadow_gray dark:hover:bg-vl_gray"
                      } py-1 px-4 rounded-md font-normal  text-sm`}
                    >
                      Business Referral
                    </Link>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6">
                  <AccordionTrigger
                    className={`py-3 pb-1 px-4 rounded-md hover:bg-shadow_gray dark:hover:bg-vl_gray`}
                  >
                    <span
                      className={`flex gap-3 items-center dark:text-white text-text_gray`}
                    >
                      <IoWalletSharp size={20} />
                      <p className={` font-normal  text-sm`}>Wallet</p>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col pt-2 sm:pl-6 gap-2">
                    <Link
                      href="/wallet/transaction"
                      prefetch={true}
                      className={`flex gap-3 items-center py-1 px-4 rounded-md ${
                        pathname === "/wallet/transaction"
                          ? "bg-primary_text dark:bg-secondary_text text-white"
                          : "dark:text-white text-text_gray hover:bg-shadow_gray dark:hover:bg-vl_gray"
                      }`}
                    >
                      <GrTransaction size={20} />
                      <p className={` font-normal  text-sm`}>Transaction</p>
                    </Link>
                    <Link
                      href="/wallet/user-wallet"
                      prefetch={true}
                      className={`flex gap-3 items-center py-1 px-4 rounded-md ${
                        pathname === "/wallet/user-wallet"
                          ? "bg-primary_text dark:bg-secondary_text text-white"
                          : "dark:text-white text-text_gray hover:bg-shadow_gray dark:hover:bg-vl_gray"
                      }`}
                    >
                      <IoWalletOutline size={20} />
                      <p className={` font-normal  text-sm`}>User Wallet</p>
                    </Link>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Link
                href="/kyc"
                prefetch={true}
                className={`flex gap-3 items-center pt-3 pb-1 px-4 rounded-md ${
                  pathname === "/kyc"
                    ? "bg-primary_text dark:bg-secondary_text text-white"
                    : "dark:text-white text-text_gray hover:bg-shadow_gray dark:hover:bg-vl_gray"
                }`}
              >
                <GrDocumentVerified size={20} />
                <p className={` font-normal  text-sm`}>KYC</p>
              </Link>

              <Link
                href="/notification"
                prefetch={true}
                className={`flex gap-[10px] items-center pt-2 pb-[2px] pl-3 px-4 rounded-md ${
                  pathname === "/notification"
                    ? "bg-primary_text dark:bg-secondary_text text-white"
                    : "dark:text-white text-text_gray hover:bg-shadow_gray dark:hover:bg-vl_gray"
                }`}
              >
                <IoIosNotifications size={26} />
                <p className={` font-normal  text-sm`}>Notification</p>
              </Link>

              <Link
                href="/partners"
                prefetch={true}
                className={`flex gap-3 items-center pt-[10px] pb-1 pl-4 px-4 rounded-md ${
                  pathname === "/partners"
                    ? "bg-primary_text dark:bg-secondary_text text-white"
                    : "dark:text-white text-text_gray hover:bg-shadow_gray dark:hover:bg-vl_gray"
                }`}
              >
                <FaHandshake size={20} />
                <p className={` font-normal  text-sm`}>Partners</p>
              </Link>

              <Link
                href="/project"
                prefetch={true}
                className={`flex gap-2 items-center pt-2 pb-[2px] pl-4 px-4 rounded-md ${
                  pathname === "/project"
                    ? "bg-primary_text dark:bg-secondary_text text-white"
                    : "dark:text-white text-text_gray hover:bg-shadow_gray dark:hover:bg-vl_gray"
                }`}
              >
                <MdOutlineEditNote size={25} />
                <p className={` font-normal  text-sm `}>Project</p>
              </Link>

              <Link
                href="/subscription"
                prefetch={true}
                className={`flex gap-3 items-center py-3 pb-1 px-4 rounded-md ${
                  pathname === "/subscription"
                    ? "bg-primary_text dark:bg-secondary_text text-white"
                    : "dark:text-white text-text_gray hover:bg-shadow_gray dark:hover:bg-vl_gray"
                }`}
              >
                <MdOutlineSubscriptions size={20} />
                <p className={` font-normal  text-sm `}>Subscription</p>
              </Link>

              <Link
                href="/withdraw"
                prefetch={true}
                className={`flex gap-3 items-center py-3 pb-1 px-4 rounded-md ${
                  pathname === "/withdraw"
                    ? "bg-primary_text dark:bg-secondary_text text-white"
                    : "dark:text-white text-text_gray hover:bg-shadow_gray dark:hover:bg-vl_gray"
                }`}
              >
                <PiHandWithdraw size={20} />
                <p className={` font-normal  text-sm`}>Withdraw</p>
              </Link>
            </div>
            {status === "authenticated" ? (
              <Button
                onClick={handleLogout}
                className="bg-primary_text dark:bg-secondary_text hover:bg-l_orange dark:hover:bg-blue text-white w-full  h-8 mb-6 self-center rounded-lg"
              >
                Sign out
              </Button>
            ) : (
              " "
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Render only icons when the collapsible sidebar is closed */}
      {!isOpen && (
        <div className="flex flex-col items-start gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="pl-2">
                <Link href="/" prefetch={true}>
                  <RxDashboard
                    size={20}
                    className={`${
                      pathname === "/"
                        ? "text-primary_text dark:text-secondary_text"
                        : "dark:text-white text-text_gray"
                    }`}
                  />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Dashboard</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="pl-2">
                {" "}
                <Link href="/users" prefetch={true}>
                  <FaUserGroup
                    size={20}
                    className={`${
                      pathname === "/users"
                        ? "text-primary_text dark:text-secondary_text"
                        : "dark:text-white text-text_gray"
                    }`}
                  />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Users</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="pl-2">
                <Link href="/station" prefetch={true}>
                  <BsFillHouseFill
                    size={20}
                    className={`${
                      pathname === "/station"
                        ? "text-primary_text dark:text-secondary_text"
                        : "dark:text-white text-text_gray"
                    }`}
                  />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Station</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="pl-[5px]">
                <Link href="/restaurant" prefetch={true}>
                  <MdFoodBank
                    size={25}
                    className={`${
                      pathname === "/restaurant"
                        ? "text-primary_text dark:text-secondary_text"
                        : "dark:text-white text-text_gray"
                    }`}
                  />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Restaurant</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="pl-2">
                <span
                  className={`flex gap-3 items-center dark:text-white text-text_gray`}
                >
                  <FaMoneyBillTransfer size={20} />
                </span>
              </TooltipTrigger>
              <TooltipContent className="flex flex-col pt-2 pl-2 gap-1">
                <Link
                  href={"/overall-transaction/total-billing"}
                  prefetch={true}
                  className={`${
                    pathname === "/overall-transaction/total-billing"
                      ? "bg-primary_text dark:bg-secondary_text text-white"
                      : "dark:text-white text-text_gray hover:bg-shadow_gray dark:hover:bg-vl_gray"
                  } py-3 pb-1 px-4 rounded-md font-normal  text-sm`}
                >
                  Total Billing
                </Link>
                <Link
                  href={"/overall-transaction/total-business"}
                  prefetch={true}
                  className={`${
                    pathname === "/overall-transaction/total-business"
                      ? "bg-primary_text dark:bg-secondary_text text-white"
                      : "dark:text-white text-text_gray hover:bg-shadow_gray dark:hover:bg-vl_gray"
                  } py-3 pb-1 px-4 rounded-md font-normal  text-sm`}
                >
                  Total Business
                </Link>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="pl-2">
                <span
                  className={`flex gap-3 items-center dark:text-white text-text_gray`}
                >
                  <ImDatabase size={18} />
                </span>
              </TooltipTrigger>
              <TooltipContent className="flex flex-col pt-2 pl-2 gap-1">
                <Link
                  href={"/meta/business-type"}
                  prefetch={true}
                  className={`flex gap-2 items-center py-3 pb-1 px-2 rounded-md ${
                    pathname === "/meta/business-type"
                      ? "bg-primary_text dark:bg-secondary_text text-white"
                      : "dark:text-white text-text_gray hover:bg-shadow_gray dark:hover:bg-vl_gray"
                  }`}
                >
                  <BsFillBriefcaseFill size={19} />
                  <p className={` font-normal  text-sm`}>Business Type</p>
                </Link>

                <Link
                  href={"/meta/company-info"}
                  prefetch={true}
                  className={`flex gap-2 items-center py-3 pb-1 px-2 rounded-md ${
                    pathname === "/meta/company-info"
                      ? "bg-primary_text dark:bg-secondary_text text-white"
                      : "dark:text-white text-text_gray hover:bg-shadow_gray dark:hover:bg-vl_gray"
                  }`}
                >
                  <AiFillInfoCircle size={20} />
                  <p className={` font-normal  text-sm`}>Company Information</p>
                </Link>

                <Link
                  href={"/meta/continent"}
                  prefetch={true}
                  className={`flex gap-2 items-center py-3 pb-1 px-2 rounded-md ${
                    pathname === "/meta/continent"
                      ? "bg-primary_text dark:bg-secondary_text text-white"
                      : "dark:text-white text-text_gray hover:bg-shadow_gray dark:hover:bg-vl_gray"
                  }`}
                >
                  <FaGlobeAmericas size={20} />
                  <p className={` font-normal  text-sm`}>Continent</p>
                </Link>

                <Link
                  href={"/meta/country"}
                  prefetch={true}
                  className={`flex gap-2 items-center py-3 pb-1 px-2 rounded-md ${
                    pathname === "/meta/country"
                      ? "bg-primary_text dark:bg-secondary_text text-white"
                      : "dark:text-white text-text_gray hover:bg-shadow_gray dark:hover:bg-vl_gray"
                  }`}
                >
                  <BsFlagFill size={20} />
                  <p className={` font-normal  text-sm`}>Country</p>
                </Link>
                <Link
                  href={"/meta/currency"}
                  prefetch={true}
                  className={`flex gap-2 items-center py-3 pb-1 px-2 rounded-md ${
                    pathname === "/meta/currency"
                      ? "bg-primary_text dark:bg-secondary_text text-white"
                      : "dark:text-white text-text_gray hover:bg-shadow_gray dark:hover:bg-vl_gray"
                  }`}
                >
                  <HiCurrencyDollar size={20} />
                  <p className={` font-normal  text-sm`}>Currency</p>
                </Link>

                <Link
                  href={"/meta/faqs"}
                  prefetch={true}
                  className={`flex gap-2 items-center py-3 pb-1 px-2 rounded-md ${
                    pathname === "/meta/faqs"
                      ? "bg-primary_text dark:bg-secondary_text text-white"
                      : "dark:text-white text-text_gray hover:bg-shadow_gray dark:hover:bg-vl_gray"
                  }`}
                >
                  <RiQuestionnaireFill size={20} />
                  <p className={` font-normal  text-sm`}>FAQs</p>
                </Link>

                <Link
                  href={"/meta/privacy-policy"}
                  prefetch={true}
                  className={`flex gap-2 items-center py-3 pb-1 px-2 rounded-md ${
                    pathname === "/meta/privacy-policy"
                      ? "bg-primary_text dark:bg-secondary_text text-white"
                      : "dark:text-white text-text_gray hover:bg-shadow_gray dark:hover:bg-vl_gray"
                  }`}
                >
                  <BsFileEarmarkLock2 size={20} />
                  <p className={` font-normal  text-sm`}>Privacy Policy</p>
                </Link>

                <Link
                  href={"/meta/terms-and-conditions"}
                  prefetch={true}
                  className={`flex gap-2 items-center py-3 pb-1 px-2 rounded-md ${
                    pathname === "/meta/terms-and-conditions"
                      ? "bg-primary_text dark:bg-secondary_text text-white"
                      : "dark:text-white text-text_gray hover:bg-shadow_gray dark:hover:bg-vl_gray"
                  }`}
                >
                  <HiOutlineClipboardDocumentCheck size={20} />
                  <p className={` font-normal  text-sm`}>
                    Terms and Conditions
                  </p>
                </Link>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="pl-2">
                <span className={` dark:text-white text-text_gray`}>
                  <IoCalendarSharp size={20} />
                </span>
              </TooltipTrigger>
              <TooltipContent className="flex flex-col pt-2 pl-2 gap-1">
                <Link
                  href={"/event/event-create"}
                  prefetch={true}
                  className={`flex gap-3 items-center py-3 pb-1 px-4 rounded-md ${
                    pathname === "/event/event-create"
                      ? "bg-primary_text dark:bg-secondary_text text-white"
                      : "dark:text-white text-text_gray hover:bg-shadow_gray dark:hover:bg-vl_gray"
                  }`}
                >
                  <TbCalendarPlus size={20} />
                  <p className="font-normal text-sm"> Event Create</p>
                </Link>

                <Link
                  href={"/event/event-fee"}
                  prefetch={true}
                  className={`flex gap-3 items-center py-3 pb-1 px-4 rounded-md ${
                    pathname === "/event/event-fee"
                      ? "bg-primary_text dark:bg-secondary_text text-white"
                      : "dark:text-white text-text_gray hover:bg-shadow_gray dark:hover:bg-vl_gray"
                  }`}
                >
                  <TbCalendarDollar size={20} />
                  <p className={` font-normal  text-sm `}>Event Fee</p>
                </Link>

                <Link
                  href={"/event/event-book"}
                  prefetch={true}
                  className={`flex gap-3 items-center py-3 pb-1 px-4 rounded-md ${
                    pathname === "/event/event-book"
                      ? "bg-primary_text dark:bg-secondary_text text-white"
                      : "dark:text-white text-text_gray hover:bg-shadow_gray dark:hover:bg-vl_gray"
                  }`}
                >
                  <TbCalendarCheck size={20} />
                  <p className={` font-normal  text-sm `}>Event Book</p>
                </Link>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="pl-2">
                <span className={` dark:text-white text-text_gray`}>
                  <FaAddressCard size={20} />
                </span>
              </TooltipTrigger>
              <TooltipContent className="flex flex-col pt-2 pl-2 gap-1">
                <Link
                  href={"/membership/membership"}
                  prefetch={true}
                  className={`${
                    pathname === "/membership/membership"
                      ? "bg-primary_text dark:bg-secondary_text text-white"
                      : "dark:text-white text-text_gray hover:bg-shadow_gray dark:hover:bg-vl_gray"
                  } py-3 pb-1 px-4 rounded-md font-normal  text-sm`}
                >
                  Membership
                </Link>
                <Link
                  href={"/membership/membership-type"}
                  prefetch={true}
                  className={`${
                    pathname === "/membership/membership-type"
                      ? "bg-primary_text dark:bg-secondary_text text-white"
                      : "dark:text-white text-text_gray hover:bg-shadow_gray dark:hover:bg-vl_gray"
                  } py-3 pb-1 px-4 rounded-md font-normal  text-sm`}
                >
                  Membership Type
                </Link>
                <Link
                  href={"/membership/project-discount"}
                  prefetch={true}
                  className={`${
                    pathname === "/membership/project-discount"
                      ? "bg-primary_text dark:bg-secondary_text text-white"
                      : "dark:text-white text-text_gray hover:bg-shadow_gray dark:hover:bg-vl_gray"
                  } py-3 pb-1 px-4 rounded-md font-normal  text-sm`}
                >
                  Project Discount
                </Link>
                <Link
                  href={"/membership/type-discount"}
                  prefetch={true}
                  className={`${
                    pathname === "/membership/type-discount"
                      ? "bg-primary_text dark:bg-secondary_text text-white"
                      : "dark:text-white text-text_gray hover:bg-shadow_gray dark:hover:bg-vl_gray"
                  } py-3 pb-1 px-4 rounded-md font-normal  text-sm`}
                >
                  Type Discount
                </Link>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="pl-2">
                <span
                  className={`flex justify-center items-center dark:text-white text-text_gray`}
                >
                  <PiNetworkFill size={20} />
                </span>
              </TooltipTrigger>
              <TooltipContent className="flex flex-col pt-2 pl-2 gap-1">
                <Link
                  href={"/referral/referral"}
                  prefetch={true}
                  className={`${
                    pathname === "/referral/referral"
                      ? "bg-primary_text dark:bg-secondary_text text-white"
                      : "dark:text-white text-text_gray hover:bg-shadow_gray dark:hover:bg-vl_gray"
                  } py-3 pb-1 px-4 rounded-md font-normal  text-sm`}
                >
                  Referral
                </Link>
                <Link
                  href={"/referral/business-referral"}
                  prefetch={true}
                  className={`${
                    pathname === "/referral/business-referral"
                      ? "bg-primary_text dark:bg-secondary_text text-white"
                      : "dark:text-white text-text_gray hover:bg-shadow_gray dark:hover:bg-vl_gray"
                  } py-3 pb-1 px-4 rounded-md font-normal  text-sm`}
                >
                  Business Referral
                </Link>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="pl-2">
                <span
                  className={`flex gap-3 items-center dark:text-white text-text_gray`}
                >
                  <IoWalletSharp size={20} />
                </span>
              </TooltipTrigger>
              <TooltipContent className="flex flex-col pt-2 pl-2 gap-1">
                <Link
                  href="/wallet/transaction"
                  prefetch={true}
                  className={`flex gap-3 items-center py-3 pb-1 px-4 rounded-md ${
                    pathname === "/wallet/transaction"
                      ? "bg-primary_text dark:bg-secondary_text text-white"
                      : "dark:text-white text-text_gray hover:bg-shadow_gray dark:hover:bg-vl_gray"
                  }`}
                >
                  <GrTransaction size={20} />
                  <p className={` font-normal  text-sm`}>Transaction</p>
                </Link>
                <Link
                  href="/wallet/user-wallet"
                  prefetch={true}
                  className={`flex gap-3 items-center py-3 pb-1 px-4 rounded-md ${
                    pathname === "/wallet/user-wallet"
                      ? "bg-primary_text dark:bg-secondary_text text-white"
                      : "dark:text-white text-text_gray hover:bg-shadow_gray dark:hover:bg-vl_gray"
                  }`}
                >
                  <IoWalletOutline size={20} />
                  <p className={` font-normal  text-sm`}>User Wallet</p>
                </Link>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="pl-2">
                <Link href="/kyc" prefetch={true}>
                  <GrDocumentVerified
                    size={20}
                    className={`${
                      pathname === "/kyc"
                        ? "text-primary_text dark:text-secondary_text"
                        : "dark:text-white text-text_gray"
                    }`}
                  />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>KYC</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="pl-1">
                <Link href="/notification" prefetch={true}>
                  <IoIosNotifications
                    size={26}
                    className={`${
                      pathname === "/notification"
                        ? "text-primary_text dark:text-secondary_text"
                        : "dark:text-white text-text_gray"
                    }`}
                  />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Notification</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="pl-2">
                <Link href="/partners" prefetch={true}>
                  <FaHandshake
                    size={20}
                    className={`${
                      pathname === "/partners"
                        ? "text-primary_text dark:text-secondary_text"
                        : "dark:text-white text-text_gray"
                    }`}
                  />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Partners</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="pl-2">
                <Link href="/project" prefetch={true}>
                  <MdOutlineEditNote
                    size={25}
                    className={`${
                      pathname === "/project"
                        ? "text-primary_text dark:text-secondary_text"
                        : "dark:text-white text-text_gray"
                    }`}
                  />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Project</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="pl-2">
                <Link href="/subscription" prefetch={true}>
                  <MdOutlineSubscriptions
                    size={20}
                    className={`${
                      pathname === "/subscription"
                        ? "text-primary_text dark:text-secondary_text"
                        : "dark:text-white text-text_gray"
                    }`}
                  />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Subscription</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="pl-2">
                <Link href="/withdraw" prefetch={true}>
                  <PiHandWithdraw
                    size={20}
                    className={`${
                      pathname === "/withdraw"
                        ? "text-primary_text dark:text-secondary_text"
                        : "dark:text-white text-text_gray"
                    }`}
                  />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Withdraw</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </ScrollArea>
  );
};

export default SideBar;
