"use client";

import { axiosPrivate } from "@/axios/axios";
import { setStationData } from "@/lib/store/features/station/stationSlice";
import { useAppSelector } from "@/lib/store/hooks";
import { RootState } from "@/lib/store/store";
import { StationData } from "@/types/types";
import { useSession } from "next-auth/react";
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
  const { data: session } = useSession();
  const [stationList, setStationList] = useState<StationData[]>([]);
  const [stationDetails, setStationDetails] = useState<StationData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  const fetchStationList = async () => {
    if (!session?.accessToken) return; // Ensure session is available
    try {
      const res = await axiosPrivate.get(
        "https://api.morefood.se/api/moreclub/stations/list/",
        {
          headers: {
            Authorization: `Bearer ${
              session?.accessToken || session?.user?.token
            }`,
          },
        }
      );
      console.log(res.data.data);
      setStationList(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

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

  useEffect(() => {
    if (session) {
      fetchStationList();
    }
  }, [session, params.stationId, dispatch]);

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
        <div>
          <h3>Station: {StationName}</h3>
          <h3>Station ID: {params.stationId}</h3>
        </div>
        <div className="flex gap-4">
          <div>
            <Link
              href={`/station/create`}
              className="bg-primary_text dark:bg-btn_blue text-white text-sm hover:bg-l_orange dark:hover:bg-blue py-1 px-4 rounded place-self-end"
            >
              Edit
            </Link>
          </div>
          <div>
            <Link
              href={`/station/${params.stationId}/${params.stationName}/menu`}
              className="bg-primary_text dark:bg-btn_blue text-white text-sm hover:bg-l_orange dark:hover:bg-blue py-1 px-4 rounded place-self-end"
            >
              Menus
            </Link>
          </div>
        </div>
        <div>
          <h2>Store Value</h2>
          {stationData ? (
            <div>
              <p>{stationData?.id}</p>
              <p>{stationData?.name}</p>
              <p>{stationData?.address}</p>
              <p>{stationData?.email}</p>
              <p>{stationData?.banner}</p>
              <p>{stationData?.logo}</p>
              <Image
                src={stationData.banner || ""}
                alt="banner"
                width={200}
                height={200}
              />
            </div>
          ) : (
            <p>Detail unavailable.</p>
          )}
        </div>

        {isLoading ? (
          <p>Loading....</p>
        ) : (
          <div>
            <h2>Variable Value</h2>
            {stationDetails ? (
              <div>
                <p>{stationDetails?.id}</p>
                <p>{stationDetails?.name}</p>
                <p>{stationDetails?.address}</p>
                <p>{stationDetails?.email}</p>
                <Image
                  src={stationDetails.banner || ""}
                  alt="banner"
                  width={200}
                  height={200}
                />
              </div>
            ) : (
              <p>Detail unavailable.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
