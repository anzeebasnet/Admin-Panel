"use client";

import {
  useCuisineList,
  useNearbyStationDetail,
  useNearbyStationList,
} from "@/lib/react-query/queriesAndMutations";
import { useAppDispatch } from "@/lib/store/hooks";
import { Open_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import { HiPlusSmall } from "react-icons/hi2";
import { CiEdit } from "react-icons/ci";
import {
  clearCuisineItem,
  setCuisineItem,
} from "@/lib/store/features/cuisine/CuisineSlice";
import { NearByStationDetail, NearbyStations } from "@/types/types";

const open_sans = Open_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const Page = ({
  params,
}: {
  params: {
    restroId: string;
    restroName: string;
    stationId: string;
    stationName: string;
  };
}) => {
  const dispatch = useAppDispatch();
  const { data: nearbyStationDetail, isLoading: isLoading } =
    useNearbyStationDetail(params.stationId);
  const stationName = decodeURIComponent(params.stationName);

  useEffect(() => {
    dispatch(clearCuisineItem());
  }, [dispatch]);

  return (
    <div
      className={` bg-white dark:bg-secondary_dark rounded-sm p-6 flex flex-col gap-6 shadow-sm shadow-vll_gray dark:shadow-none ${open_sans.className}`}
    >
      <div className="flex sm:flex-row flex-col justify-between">
        <h1
          className={`text-primary_text dark:text-secondary_text text-lg font-medium ${open_sans.className}`}
        >
          {stationName}
        </h1>
      </div>

      <div className="flex flex-col gap-5">
        {isLoading ? (
          <p>Loading Station Detail...</p>
        ) : nearbyStationDetail ? (
          <div className="flex flex-col gap-3">
            <Image
              src={nearbyStationDetail?.banner || ""}
              alt="restaurant banner"
              width={300}
              height={200}
              className="rounded"
            />
            <div className="flex flex-col gap-1">
              <h3 className="font-medium text-base capitalize">
                {nearbyStationDetail.name}
              </h3>
              <div className="font-normal text-sm flex gap-1">
                <h3 className="font-semibold">Restaurant ID :</h3>{" "}
                {nearbyStationDetail.id}
              </div>
              <div className="font-normal text-sm flex gap-1">
                <h3 className="font-semibold">Address :</h3>{" "}
                {nearbyStationDetail.address}
              </div>
              <div className="font-normal text-sm flex gap-1">
                <h3 className="font-semibold">Contact :</h3>{" "}
                {nearbyStationDetail.contact_no}
              </div>
              <div className="font-normal text-sm flex gap-1">
                <h3 className="font-semibold">Email Address :</h3>{" "}
                {nearbyStationDetail.email}
              </div>
              <div className="font-normal text-sm flex gap-1">
                <h3 className="font-semibold">Short Description :</h3>{" "}
                {nearbyStationDetail.short_description}
              </div>
              <div className="font-normal text-sm flex gap-1">
                <h3 className="font-semibold">Long Description :</h3>{" "}
                {nearbyStationDetail.long_description}
              </div>
            </div>
          </div>
        ) : (
          <p>Couldn&apos;t load station&apos;s detail!</p>
        )}

        <div>
          <Link
            href={`/restaurant/${params.restroId}/${params.restroName}/nearbyStation/${params.stationId}/${params.stationName}/my-menu/`}
            className="bg-primary_text dark:bg-btn_blue text-white text-sm hover:bg-l_orange dark:hover:bg-blue py-1 px-4 rounded place-self-end"
          >
            My Menu
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
