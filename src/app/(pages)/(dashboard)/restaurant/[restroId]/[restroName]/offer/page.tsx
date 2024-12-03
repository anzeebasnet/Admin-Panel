"use client";

import { useOfferList } from "@/lib/react-query/queriesAndMutations";
import { useAppDispatch } from "@/lib/store/hooks";
import { Offer } from "@/types/types";
import { Open_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { HiPlusSmall } from "react-icons/hi2";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CgArrowLeft } from "react-icons/cg";

const open_sans = Open_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const Page = ({
  params,
}: {
  params: { restroId: string; restroName: string };
}) => {
  const { data: offers, isLoading: isLoading } = useOfferList(params.restroId);
  const restroName = decodeURIComponent(params.restroName);

  return (
    <div
      className={` bg-white dark:bg-secondary_dark rounded-sm p-6 flex flex-col gap-6 shadow-sm shadow-vll_gray dark:shadow-none ${open_sans.className}`}
    >
      <div className="flex sm:flex-row flex-col sm:justify-between sm:gap-0 gap-4">
        <Breadcrumb className="mb-4">
          <BreadcrumbList className="flex sm:gap-1">
            <BreadcrumbItem>
              <BreadcrumbLink
                href={`/restaurant/${params.restroId}/${params.restroName}/`}
              >
                <CgArrowLeft
                  className="text-primary_text dark:text-sidebar_blue"
                  size={25}
                />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage className="sm:text-xl text-lg font-medium text-primary_text dark:text-sidebar_blue">
                {restroName} Offers
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex gap-4">
          <Link
            href={`/restaurant/${params.restroId}/${params.restroName}/offer/create`}
            className="bg-primary_text dark:bg-btn_blue text-white text-sm hover:bg-l_orange dark:hover:bg-blue 
            py-1 px-4 rounded place-self-end"
          >
            <div className="flex gap-1 items-center">
              Add New Offer <HiPlusSmall size={23} />
            </div>
          </Link>
        </div>
      </div>
      <div className="pl-1">
        {isLoading ? (
          <p>Loading offers...</p>
        ) : offers && offers.length > 0 ? (
          <div className="flex flex-wrap sm:gap-8 gap-4">
            {offers.map((offer: Offer, index: any) => (
              <div
                key={index}
                className="flex flex-col dark:bg-primary_dark rounded-md bg-white shadow-md shadow-vll_gray dark:shadow-none"
              >
                <div className="relative">
                  <Image
                    src={offer.banner || ""}
                    alt="offer banner"
                    width={100}
                    height={100}
                    className="w-80 h-64 rounded-t-md"
                  />
                  <h2
                    className="absolute top-0 right-0 bg-beige dark:bg-card_blue text-deep_red dark:text-white w-full 
                  p-4 rounded-t-md bg-opacity-5 text-center  font-semibold place-self-center text-sm capitalize"
                  >
                    {offer.name}
                  </h2>
                </div>
                <div className="flex flex-col gap-1 p-4 bg-beige dark:bg-card_blue rounded-b-md">
                  <p className="text-[15px] font-medium">
                    Starts at{" "}
                    {new Date(offer.start_offer).toLocaleDateString("en-US", {
                      weekday: "long",
                      day: "2-digit",
                      month: "short",
                      year: "2-digit",
                    })}
                  </p>
                  <p className="text-[15px] font-medium">
                    Up-to{" "}
                    {new Date(offer.end_offer).toLocaleDateString("en-US", {
                      weekday: "long",
                      day: "2-digit",
                      month: "short",
                      year: "2-digit",
                    })}
                  </p>
                  <div className="flex gap-2 mt-2">
                    {offer.food_item?.map((item, index) => (
                      <div key={index}>
                        <p className="bg-deep_red dark:bg-sidebar_blue text-white rounded text-[13px] p-1">
                          {item.name}
                        </p>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm font-medium mt-1">
                    Rs. {offer.price} only
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : offers?.length <= 0 ? (
          <p>No offer found. Add new offer!</p>
        ) : (
          <p>Couldn&apos;t load offer list!</p>
        )}
      </div>
    </div>
  );
};

export default Page;
