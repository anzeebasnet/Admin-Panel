"use client";

import { useStationDetail } from "@/lib/react-query/queriesAndMutations";
import { setStationData } from "@/lib/store/features/station/stationSlice";
import { useAppSelector } from "@/lib/store/hooks";
import { RootState } from "@/lib/store/store";
import { Open_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

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
      <div className="flex sm:flex-row flex-col justify-between">
        <h1
          className={`text-primary_text dark:text-secondary_text text-lg font-medium ${open_sans.className}`}
        >
          Station Details
        </h1>
      </div>

      <div className="flex flex-col gap-5">
        {isLoading ? (
          <p>Loading Station Detail...</p>
        ) : !stationDetail ? (
          <p>Station Detail not found!</p>
        ) : stationDetail ? (
          <div className="flex flex-col gap-3">
            <Image
              src={stationDetail?.banner || ""}
              alt="station banner"
              width={300}
              height={200}
              className="rounded"
            />
            <div className="flex flex-col gap-1">
              <div className="font-medium text-base capitalize flex gap-1">
                <h3 className="font-medium">{stationDetail.name}</h3>
              </div>
              <div className="font-normal text-sm flex gap-1">
                <h3 className="font-medium">Station ID :</h3> {stationDetail.id}
              </div>
              <div className="font-normal text-sm flex gap-1">
                <h3 className="font-medium">Email :</h3> {stationDetail.email}
              </div>
              <div className="font-normal text-sm flex gap-1">
                <h3 className="font-medium">Address :</h3>{" "}
                {stationDetail.address}
              </div>
              <div className="font-normal text-sm flex gap-1">
                <h3 className="font-medium">Contact :</h3>{" "}
                {stationDetail.contact_no}
              </div>
              {stationDetail.restaurant ? (
                <div className="font-normal text-sm flex gap-1">
                  <h3 className="font-medium">Restaurant :</h3>{" "}
                  {stationDetail.restaurant}
                </div>
              ) : (
                ""
              )}
              <div className="font-normal text-sm flex gap-1">
                <h3 className="font-medium">Short Description :</h3>{" "}
                {stationDetail.short_description}
              </div>
              <div className="font-normal text-sm flex gap-1">
                <h3 className="font-medium">Long Description :</h3>{" "}
                {stationDetail.long_description}
              </div>
            </div>
          </div>
        ) : (
          <p>Couldn&apos;t find station detail!</p>
        )}

        <div className="flex gap-4">
          {stationData ? (
            <div>
              <Link
                href={`/station/create`}
                className="bg-primary_text dark:bg-btn_blue text-white text-sm hover:bg-l_orange dark:hover:bg-blue py-1 px-4 rounded place-self-end"
              >
                Edit Station
              </Link>
            </div>
          ) : (
            ""
          )}
          <div>
            <Link
              href={`/station/${params.stationId}/${params.stationName}/menu`}
              className="bg-primary_text dark:bg-btn_blue text-white text-sm hover:bg-l_orange dark:hover:bg-blue py-1 px-4 rounded place-self-end"
            >
              View Menu
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
