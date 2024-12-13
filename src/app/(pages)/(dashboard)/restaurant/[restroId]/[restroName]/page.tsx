"use client";

import { Separator } from "@/components/ui/separator";
import { useRestroDetail } from "@/lib/react-query/queriesAndMutations";
import { setRestroData } from "@/lib/store/features/restaurant/restaurantSlice";
import { useAppSelector } from "@/lib/store/hooks";
import { RootState } from "@/lib/store/store";
import { Open_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { CiEdit } from "react-icons/ci";
import { IoIosMail } from "react-icons/io";
import { IoLocationSharp } from "react-icons/io5";
import { MdLocalPhone } from "react-icons/md";
import { useDispatch } from "react-redux";
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
  const restroData = useAppSelector(
    (state: RootState) => state.restaurant.currentRestro
  );
  const dispatch = useDispatch();
  const RestroName = decodeURIComponent(params.restroName);
  const { data: restroDetails, isLoading: isLoading } = useRestroDetail(
    params.restroId
  );

  useEffect(() => {
    if (restroDetails) {
      dispatch(setRestroData(restroDetails));
    }
  }, [restroDetails, dispatch]);

  return (
    <div
      className={` bg-white dark:bg-secondary_dark rounded-sm p-6 flex flex-col gap-6 shadow-sm shadow-vll_gray dark:shadow-none ${open_sans.className}`}
    >
      <Breadcrumb className="-ml-1">
        <BreadcrumbList className="flex sm:gap-1">
          <BreadcrumbItem className="pl-0">
            <BreadcrumbLink href="/restaurant">
              <CgArrowLeft
                className="text-primary_text dark:text-sidebar_blue"
                size={25}
              />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbPage className="sm:text-xl text-sm font-medium text-primary_text dark:text-sidebar_blue">
              {RestroName}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-5 ">
        {isLoading ? (
          <p>Loading Restaurant Detail...</p>
        ) : !restroDetails ? (
          <p>Restaurant Detail not found!</p>
        ) : restroDetails ? (
          <div className="flex flex-col gap-8">
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
              <div className="flex flex-col gap-4">
                {restroDetails.logo ? (
                  <Image
                    src={restroDetails.logo}
                    alt="salon logo"
                    width={100}
                    height={100}
                    className="rounded-full w-36 h-36 bg-deep_red"
                  />
                ) : (
                  ""
                )}

                <div className="flex flex-col gap-2">
                  <div className=" flex items-center gap-1">
                    <h2
                      className={`text-deep_red dark:text-white sm:text-xl text-lg font-semibold`}
                    >
                      {restroDetails.name}
                    </h2>
                    {restroData ? (
                      <Link
                        href={`/restaurant/create`}
                        className="place-self-end"
                      >
                        <CiEdit
                          size={24}
                          className="text-deep_red dark:text-white"
                        />
                      </Link>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="flex gap-1 items-end">
                    <IoLocationSharp
                      size={22}
                      className="text-primary_text dark:text-sidebar_blue"
                    />
                    <p className="text-sm font-medium">
                      {restroDetails.address}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {restroDetails.is_delivery ? (
                      <div className=" ">
                        <p className="text-sm font-medium ">Home Delivery</p>
                      </div>
                    ) : (
                      ""
                    )}
                    {restroDetails.is_delivery && restroDetails.is_dine ? (
                      <div className="mx-1">
                        <Separator
                          orientation="vertical"
                          color="black"
                          className="bg-gray-400 w-[2px] "
                        />
                      </div>
                    ) : restroDetails.is_delivery && restroDetails.is_pickup ? (
                      <div className="mx-1">
                        <Separator
                          orientation="vertical"
                          color="black"
                          className="bg-gray-400 w-[2px] "
                        />
                      </div>
                    ) : (
                      ""
                    )}
                    {restroDetails.is_dine ? (
                      <div className="">
                        <p className="text-sm font-medium ">Dine-in</p>
                      </div>
                    ) : (
                      ""
                    )}
                    {restroDetails.is_dine && restroDetails.is_pickup ? (
                      <div className="mx-1">
                        <Separator
                          orientation="vertical"
                          color="black"
                          className="bg-gray-400 w-[2px] "
                        />
                      </div>
                    ) : (
                      ""
                    )}
                    {restroDetails.is_pickup ? (
                      <div className="">
                        <p className="text-sm font-medium ">Pick up</p>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="flex sm:flex-row flex-col gap-2">
                    <div className="flex gap-1 items-end ">
                      <MdLocalPhone
                        size={22}
                        className="text-primary_text dark:text-sidebar_blue"
                      />
                      <p className="text-sm font-medium ">
                        {restroDetails.contact_no}
                      </p>
                    </div>
                    <Separator
                      orientation="vertical"
                      color="black"
                      className="bg-gray-400 w-[2px] sm:block hidden"
                    />
                    <div className="flex gap-1 items-end ">
                      <IoIosMail
                        size={22}
                        className="text-primary_text dark:text-sidebar_blue"
                      />
                      <p className="text-sm font-medium ">
                        {restroDetails.email}
                      </p>
                    </div>
                  </div>

                  <div className="text-sm font-medium  flex gap-2">
                    <p>Delivery in {restroDetails.delivery_time}, </p>
                    <p>Minimum Order of Rs.{restroDetails.min_order}</p>
                  </div>

                  <p className="text-sm font-medium ">
                    {restroDetails.short_description}
                  </p>
                </div>
              </div>
              <div className="flex items-center lg:place-self-end h-full">
                <Image
                  src={restroDetails?.banner || ""}
                  alt="salon banner"
                  width={500}
                  height={500}
                  className="rounded w-[35rem] h-80 bg-deep_red"
                />
              </div>
            </div>
            <div className="inline-flex flex-wrap gap-4  mt-4">
              <Link
                href={`/restaurant/${params.restroId}/${params.restroName}/menu`}
                className="flex flex-col items-center justify-center gap-2 w-40 h-40 bg-beige hover:bg-l_orange dark:bg-blue dark:hover:bg-sidebar_blue text-deep_red hover:text-white  dark:text-white rounded"
              >
                <Image
                  src={"/images/menuu.png"}
                  alt="menu"
                  width={200}
                  height={200}
                  className="w-16 h-16 rounded"
                />
                <p className="text-sm font-semibold">Menus</p>
              </Link>

              <Link
                href={`/restaurant/${params.restroId}/${params.restroName}/cuisines`}
                className="flex flex-col items-center justify-center gap-2 w-40 h-40 bg-beige hover:bg-l_orange dark:bg-blue dark:hover:bg-sidebar_blue text-deep_red hover:text-white  dark:text-white rounded"
              >
                <Image
                  src={"/images/cuisine.png"}
                  alt="menu"
                  width={200}
                  height={200}
                  className="w-16 h-16  rounded"
                />
                <p className="text-sm font-semibold">Cuisines</p>
              </Link>

              <Link
                href={`/restaurant/${params.restroId}/${params.restroName}/offer`}
                className="flex flex-col items-center justify-center gap-2 w-40 h-40 bg-beige hover:bg-l_orange dark:bg-blue dark:hover:bg-sidebar_blue text-deep_red hover:text-white  dark:text-white rounded"
              >
                <Image
                  src={"/images/offer.png"}
                  alt="menu"
                  width={200}
                  height={200}
                  className="w-16 h-16  rounded"
                />
                <p className="text-sm font-semibold">Offers</p>
              </Link>

              <Link
                href={`/restaurant/${params.restroId}/${params.restroName}/order`}
                className="flex flex-col items-center justify-center gap-2 w-40 h-40 bg-beige hover:bg-l_orange dark:bg-blue dark:hover:bg-sidebar_blue text-deep_red hover:text-white  dark:text-white rounded"
              >
                <Image
                  src={"/images/order.png"}
                  alt="menu"
                  width={200}
                  height={200}
                  className="w-16 h-16  rounded"
                />
                <p className="text-sm font-semibold">Orders</p>
              </Link>

              <Link
                href={`/restaurant/${params.restroId}/${params.restroName}/hours`}
                className="flex flex-col items-center justify-center gap-2 w-40 h-40 bg-beige hover:bg-l_orange dark:bg-blue dark:hover:bg-sidebar_blue text-deep_red hover:text-white  dark:text-white rounded"
              >
                <Image
                  src={"/images/opening.png"}
                  alt="menu"
                  width={200}
                  height={200}
                  className="w-16 h-16  rounded"
                />
                <p className="text-sm font-semibold">Opening Hours</p>
              </Link>

              <Link
                href={`/restaurant/${params.restroId}/${params.restroName}/nearbyStation`}
                className="flex flex-col items-center justify-center gap-2 w-40 h-40 bg-beige hover:bg-l_orange dark:bg-blue dark:hover:bg-sidebar_blue text-deep_red hover:text-white  dark:text-white rounded"
              >
                <Image
                  src={"/images/station.png"}
                  alt="menu"
                  width={200}
                  height={200}
                  className="w-16 h-16  rounded"
                />
                <p className="text-sm font-semibold">Nearby Stations</p>
              </Link>

              <Link
                href={`/restaurant/${params.restroId}/${params.restroName}/gallery`}
                className="flex flex-col items-center justify-center gap-2 w-40 h-40 bg-beige hover:bg-l_orange dark:bg-blue dark:hover:bg-sidebar_blue text-deep_red hover:text-white  dark:text-white rounded"
              >
                <Image
                  src={"/images/gallery.png"}
                  alt="menu"
                  width={200}
                  height={200}
                  className="w-16 h-16  rounded"
                />
                <p className="text-sm font-semibold">Gallery</p>
              </Link>

              <Link
                href={`/restaurant/${params.restroId}/${params.restroName}/stationOrder`}
                className="flex flex-col items-center justify-center gap-2 w-40 h-40 bg-beige hover:bg-l_orange dark:bg-blue dark:hover:bg-sidebar_blue text-deep_red hover:text-white  dark:text-white rounded"
              >
                <Image
                  src={"/images/statOrder.png"}
                  alt="menu"
                  width={200}
                  height={200}
                  className="w-16 h-16  rounded"
                />
                <p className="text-sm font-semibold">Station Orders</p>
              </Link>

              <Link
                href={`/restaurant/${params.restroId}/${params.restroName}/orderSummary`}
                className="flex flex-col items-center justify-center gap-2 w-40 h-40 bg-beige hover:bg-l_orange dark:bg-blue dark:hover:bg-sidebar_blue text-deep_red hover:text-white  dark:text-white rounded"
              >
                <Image
                  src={"/images/orderSummary.png"}
                  alt="menu"
                  width={200}
                  height={200}
                  className="w-16 h-16  rounded"
                />
                <p className="text-sm font-semibold">Order Summary</p>
              </Link>
            </div>
          </div>
        ) : (
          <p>Couldn&apos;t find restaurant detail!</p>
        )}
      </div>
    </div>
  );
};

export default Page;
