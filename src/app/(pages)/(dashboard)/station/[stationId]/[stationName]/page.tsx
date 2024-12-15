"use client";

import { Separator } from "@/components/ui/separator";
import { useStationDetail } from "@/lib/react-query/queriesAndMutations";
import { setStationData } from "@/lib/store/features/station/stationSlice";
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
import { Skeleton } from "@/components/ui/skeleton";

const open_sans = Open_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const Page = ({
  params,
}: {
  params: { stationId: string; stationName: string };
}) => {
  const dispatch = useDispatch();
  const StationName = decodeURIComponent(params.stationName);
  const stationData = useAppSelector(
    (state: RootState) => state.station.currentStation
  );
  const { data: stationDetail, isLoading: isLoading } = useStationDetail(
    params.stationId
  );

  useEffect(() => {
    if (stationDetail) {
      dispatch(setStationData(stationDetail));
    }
  }, [stationDetail, dispatch]);

  return (
    <div
      className={` bg-white dark:bg-secondary_dark rounded-sm p-6 flex flex-col gap-6 shadow-sm shadow-vll_gray dark:shadow-none ${open_sans.className}`}
    >
      <Breadcrumb className="-ml-1">
        <BreadcrumbList className="flex sm:gap-1">
          <BreadcrumbItem>
            <BreadcrumbLink href="/station">
              <CgArrowLeft
                className="text-primary_text dark:text-sidebar_blue"
                size={25}
              />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbPage className="sm:text-xl text-sm font-medium text-primary_text dark:text-sidebar_blue">
              {StationName}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-5 ">
        {isLoading ? (
          <div className="flex flex-col gap-8 ">
            <div className="grid lg:grid-cols-2 grid-cols-1 sm:gap-8 gap-4">
              <div className="flex flex-col sm:gap-4 gap-2">
                <Skeleton className="dark:bg-[#575b82]  bg-[#cccccc] h-[15vh] w-[15vh] rounded-full" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="dark:bg-[#575b82]  bg-[#cccccc] h-[3vh] w-[20vh] rounded-md" />
                  <Skeleton className="dark:bg-[#575b82]  bg-[#cccccc] h-[3vh] sm:w-[35vh] w-[25vh] rounded-md" />
                  <Skeleton className="dark:bg-[#575b82]  bg-[#cccccc] h-[3vh] sm:w-[40vh] w-[30vh] rounded-md" />
                  <Skeleton className="dark:bg-[#575b82]  bg-[#cccccc] h-[3vh] sm:w-[45vh] w-[35vh] rounded-md" />
                  <Skeleton className="dark:bg-[#575b82]  bg-[#cccccc] h-[6vh] sm:w-[60vh] w-[40vh] rounded-sm" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="dark:bg-[#575b82]  bg-[#cccccc] h-[3vh] sm:w-[16vh] w-[10vh] rounded-sm" />
                  <Skeleton className="dark:bg-[#575b82]  bg-[#cccccc] h-[3vh] sm:w-[16vh] w-[10vh] rounded-sm" />
                  <Skeleton className="dark:bg-[#575b82]  bg-[#cccccc] h-[3vh] sm:w-[16vh] w-[10vh] rounded-sm" />
                </div>
              </div>
              <Skeleton className="dark:bg-[#575b82]  bg-[#cccccc] sm:w-[40vw] w-[80vw] sm:h-[40vh] h-[20vh] rounded-sm" />
            </div>
            <div className="sm:flex sm:flex-wrap hidden gap-4">
              <Skeleton className="dark:bg-[#575b82]  bg-[#cccccc] h-[20vh] w-[20vh] rounded-sm" />
              <Skeleton className="dark:bg-[#575b82]  bg-[#cccccc] h-[20vh] w-[20vh] rounded-sm" />
              <Skeleton className="dark:bg-[#575b82]  bg-[#cccccc] h-[20vh] w-[20vh] rounded-sm" />
              <Skeleton className="dark:bg-[#575b82]  bg-[#cccccc] h-[20vh] w-[20vh] rounded-sm" />
              <Skeleton className="dark:bg-[#575b82]  bg-[#cccccc] h-[20vh] w-[20vh] rounded-sm" />
            </div>
          </div>
        ) : !stationDetail ? (
          <p>Station Detail not found!</p>
        ) : stationDetail ? (
          <div className="flex flex-col gap-8">
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
              <div className="flex flex-col gap-4">
                {stationDetail.logo ? (
                  <Image
                    src={stationDetail.logo}
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
                      {stationDetail.name}
                    </h2>
                    {stationData ? (
                      <Link href={`/station/create`} className="place-self-end">
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
                      {stationDetail.address}
                    </p>
                  </div>
                  <div className="flex sm:flex-row flex-col gap-2">
                    <div className="flex gap-1 items-end ">
                      <MdLocalPhone
                        size={22}
                        className="text-primary_text dark:text-sidebar_blue"
                      />
                      <p className="text-sm font-medium ">
                        {stationDetail.contact_no}
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
                        {stationDetail.email}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-medium ">
                    {stationDetail.short_description}
                  </p>
                </div>
              </div>
              <div className="flex items-center h-full">
                <Image
                  src={stationDetail?.banner || ""}
                  alt="salon banner"
                  width={500}
                  height={500}
                  className="rounded w-[35rem] h-80 bg-deep_red"
                />
              </div>
            </div>
            <div className="inline-flex gap-4  mt-4">
              <Link
                href={`/station/${params.stationId}/${params.stationName}/menu`}
                className="flex flex-col gap-2 justify-center items-center w-40 h-40 bg-beige hover:bg-l_orange dark:bg-blue dark:hover:bg-sidebar_blue text-deep_red hover:text-white  dark:text-white rounded"
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
            </div>
          </div>
        ) : (
          <p>Couldn&apos;t find station detail!</p>
        )}
      </div>
    </div>
  );
};

export default Page;
