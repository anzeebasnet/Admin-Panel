"use client";

import { useRestroDetail } from "@/lib/react-query/queriesAndMutations";
import { setRestroData } from "@/lib/store/features/restaurant/restaurantSlice";
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
  params: { restroId: string; restroName: string };
}) => {
  const restroData = useAppSelector(
    (state: RootState) => state.restaurant.currentRestro
  );
  const dispatch = useDispatch();
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
      <div className="flex sm:flex-row flex-col justify-between">
        <h1
          className={`text-primary_text dark:text-secondary_text text-lg font-medium ${open_sans.className}`}
        >
          Restaurant Details
        </h1>
      </div>

      <div className="flex flex-col gap-5">
        {isLoading ? (
          <p>Loading Restaurant Detail...</p>
        ) : !restroDetails ? (
          <p>Restaurant Detail not found!</p>
        ) : restroDetails ? (
          <div className="flex flex-col gap-3">
            <Image
              src={restroDetails?.banner || ""}
              alt="restaurant banner"
              width={300}
              height={200}
              className="rounded"
            />
            <div className="flex flex-col gap-1">
              <h3 className="font-medium text-base capitalize">
                {restroDetails.name}
              </h3>
              <div className="font-normal text-sm flex gap-1">
                <h3 className="font-semibold">Restaurant ID :</h3>{" "}
                {restroDetails.id}
              </div>
              <div className="font-normal text-sm flex gap-1">
                <h3 className="font-semibold">Address :</h3>{" "}
                {restroDetails.address}
              </div>
              <div className="font-normal text-sm flex gap-1">
                <h3 className="font-semibold">Contact :</h3>{" "}
                {restroDetails.contact_no}
              </div>
              <div className="font-normal text-sm flex gap-1">
                <h3 className="font-semibold">Email Address :</h3>{" "}
                {restroDetails.email}
              </div>
              <div className="font-normal text-sm flex gap-1">
                <h3 className="font-semibold">Delivery Time :</h3>{" "}
                {restroDetails.delivery_time}
              </div>
              <div className="font-normal text-sm flex gap-1">
                <h3 className="font-semibold">Minimum Order :</h3>{" "}
                {restroDetails.min_order}
              </div>
              <div className="font-normal text-sm flex gap-1">
                <h3 className="font-semibold">Maximum Station Package :</h3>{" "}
                {restroDetails.station_no_of_packed_item}
              </div>
              <div className="font-normal text-sm flex gap-1">
                <h3 className="font-semibold">Short Description :</h3>{" "}
                {restroDetails.short_description}
              </div>
              <div className="font-normal text-sm flex gap-1">
                <h3 className="font-semibold">Long Description :</h3>{" "}
                {restroDetails.long_description}
              </div>
            </div>
          </div>
        ) : (
          <p>Couldn&apos;t find restaurant detail!</p>
        )}

        <div className="flex flex-wrap gap-4">
          {restroData ? (
            <div>
              <Link
                href={`/restaurant/create`}
                className="bg-primary_text dark:bg-btn_blue text-white text-sm hover:bg-l_orange dark:hover:bg-blue py-1 px-4 rounded place-self-end"
              >
                Edit Restaurant
              </Link>
            </div>
          ) : (
            ""
          )}
          <div>
            <Link
              href={`/restaurant/${params.restroId}/${params.restroName}/menu`}
              className="bg-primary_text dark:bg-btn_blue text-white text-sm hover:bg-l_orange dark:hover:bg-blue py-1 px-4 rounded place-self-end"
            >
              Menu
            </Link>
          </div>
          <div>
            <Link
              href={`/restaurant/${params.restroId}/${params.restroName}/cuisines`}
              className="bg-primary_text dark:bg-btn_blue text-white text-sm hover:bg-l_orange dark:hover:bg-blue py-1 px-4 rounded place-self-end"
            >
              Cuisines
            </Link>
          </div>
          <div>
            <Link
              href={`/restaurant/${params.restroId}/${params.restroName}/order`}
              className="bg-primary_text dark:bg-btn_blue text-white text-sm hover:bg-l_orange dark:hover:bg-blue py-1 px-4 rounded place-self-end"
            >
              Orders
            </Link>
          </div>
          <div>
            <Link
              href={`/restaurant/${params.restroId}/${params.restroName}/hours`}
              className="bg-primary_text dark:bg-btn_blue text-white text-sm hover:bg-l_orange dark:hover:bg-blue py-1 px-4 rounded place-self-end"
            >
              Working Hours
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
