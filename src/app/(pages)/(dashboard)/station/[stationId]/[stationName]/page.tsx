"use client";

import { useStationList } from "@/lib/react-query/queriesAndMutations";
import { setStationData } from "@/lib/store/features/station/stationSlice";
import { useAppSelector } from "@/lib/store/hooks";
import { RootState } from "@/lib/store/store";
import { StationData } from "@/types/types";
import { Open_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
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
  const StationName = decodeURIComponent(params.stationName);
  const stationData = useAppSelector(
    (state: RootState) => state.station.currentStation
  );
  const dispatch = useDispatch();
  const [stationList, setStationList] = useState<StationData[]>([]);
  const [stationDetails, setStationDetails] = useState<StationData | null>(
    null
  );

  const { data: stations, isLoading: isloading } =
    useStationList(setStationList);

  // const fetchStationList = async () => {
  //   if (!session?.accessToken) return; // Ensure session is available
  //   try {
  //     const res = await axiosPrivate.get(
  //       "https://api.morefood.se/api/moreclub/stations/list/",
  //       {
  //         headers: {
  //           Authorization: `Bearer ${
  //             session?.accessToken || session?.user?.token
  //           }`,
  //         },
  //       }
  //     );
  //     console.log(res.data.data);
  //     setStationList(res.data.data);
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  useEffect(() => {
    if (stationList.length > 0) {
      const matchedData = getStationDetails(params.stationId);
      if (matchedData) {
        setStationDetails(matchedData);
      }
    }
  }, [stationList, params.stationId]);

  useEffect(() => {
    if (stationDetails) {
      dispatch(setStationData(stationDetails));
    }
  }, [stationDetails, dispatch]);

  // useEffect(() => {
  //   if (session) {
  //     fetchStationList();
  //   }
  // }, [session, params.stationId, dispatch]);

  function getStationDetails(stationID: string) {
    return stationList.find((station) => station.id === stationID) || null;
  }

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
        {isloading ? (
          <p>Loading Station Detail...</p>
        ) : !stationDetails ? (
          <p>Station Detail not found!</p>
        ) : stationDetails ? (
          <div className="flex flex-col gap-3">
            <Image
              src={stationDetails?.banner || ""}
              alt="station banner"
              width={300}
              height={200}
              className="rounded"
            />
            <div className="flex flex-col gap-1">
              <h3 className="font-medium text-base capitalize">
                {stationDetails.name}
              </h3>
              <h3 className="font-normal text-sm">
                Station ID: {stationDetails.id}
              </h3>
              <h3 className="font-normal text-sm">
                Email: {stationDetails.email}
              </h3>
              <h3 className="font-normal text-sm">
                Address: {stationDetails.address}
              </h3>
              <h3 className="font-normal text-sm">
                Contact: {stationDetails.contact_no}
              </h3>
              {stationDetails.restaurant ? (
                <h3 className="font-normal text-sm">
                  Restaurant: {stationDetails.restaurant}
                </h3>
              ) : (
                ""
              )}
              <h3 className="font-normal text-sm">
                Short Description: {stationDetails.short_description}
              </h3>
              <h3 className="font-normal text-sm">
                Long Description: {stationDetails.long_description}
              </h3>
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
