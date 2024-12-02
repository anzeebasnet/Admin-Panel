"use client";

import { useNearbyStationList } from "@/lib/react-query/queriesAndMutations";
import { useAppDispatch } from "@/lib/store/hooks";
import { Open_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import { clearCuisineItem } from "@/lib/store/features/cuisine/CuisineSlice";
import { NearbyStations } from "@/types/types";
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
  const dispatch = useAppDispatch();
  const { data: nearbyStations, isLoading: isLoading } = useNearbyStationList(
    params.restroId
  );

  useEffect(() => {
    dispatch(clearCuisineItem());
  }, [dispatch]);

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
                Nearby Stations
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="pl-1">
        {isLoading ? (
          <p>Loading Nearby Stations...</p>
        ) : nearbyStations && nearbyStations.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {nearbyStations.map((station: NearbyStations, index: any) => (
              <Link
                href={`/restaurant/${params.restroId}/${params.restroName}/nearbyStation/${station.id}/${station.name}`}
                key={index}
                className="flex flex-col gap-2 dark:bg-primary_dark rounded-md bg-white shadow-md shadow-vll_gray dark:shadow-none"
              >
                <Image
                  src={station.banner || ""}
                  alt="menu icon"
                  width={100}
                  height={100}
                  className="w-40 h-32 rounded-t-md"
                />
                <div className="flex justify-between px-2 pb-4">
                  <h2 className="text-primary_text dark:text-sidebar_blue font-semibold place-self-center text-sm capitalize">
                    {station.name}
                  </h2>
                </div>
              </Link>
            ))}
          </div>
        ) : nearbyStations.length <= 0 ? (
          <p>No stations found nearby.</p>
        ) : (
          <p>Couldn&apos;t load nearby station list!</p>
        )}
      </div>
    </div>
  );
};

export default Page;
