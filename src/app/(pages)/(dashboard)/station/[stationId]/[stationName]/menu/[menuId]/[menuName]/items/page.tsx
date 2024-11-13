"use client";

import { axiosPrivate } from "@/axios/axios";
import { FoodItem } from "@/types/types";
import { useSession } from "next-auth/react";
import { Open_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { HiPlusSmall } from "react-icons/hi2";

const open_sans = Open_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const Page = ({
  params,
}: {
  params: {
    stationId: string;
    stationName: string;
    menuId: string;
    menuName: string;
  };
}) => {
  const { data: session } = useSession();
  const [foodList, setFoodList] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchMenuList = async () => {
    try {
      const res = await axiosPrivate.get(
        `https://api.morefood.se/api/moreclub/station/${params.stationId}/${params.menuId}/food-items/`,
        {
          headers: {
            Authorization: `Bearer ${
              session?.accessToken || session?.user?.token
            }`,
          },
        }
      );
      console.log(res.data.data);
      setFoodList(res.data.data);
    } catch (error) {
      console.log("Error fetching Menu List");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuList();
  }, []);

  return (
    <div
      className={` bg-white dark:bg-secondary_dark rounded-sm p-6 flex flex-col gap-6 shadow-sm shadow-vll_gray dark:shadow-none ${open_sans.className}`}
    >
      <div className="flex sm:flex-row flex-col sm:justify-between sm:gap-0 gap-4">
        <h1
          className={`text-primary_text dark:text-secondary_text text-lg font-medium ${open_sans.className}`}
        >
          Food Items
        </h1>
        <div className="flex gap-4">
          <Link
            href={`/station/${params.stationId}/${params.stationName}/menu/${params.menuId}/${params.menuName}/items/create`}
            className="bg-primary_text dark:bg-btn_blue text-white text-sm hover:bg-l_orange dark:hover:bg-blue py-1 px-4 rounded place-self-end"
          >
            <div className="flex gap-1 items-center">
              Add New Item <HiPlusSmall size={23} />
            </div>
          </Link>
        </div>
      </div>
      <div>
        {isLoading ? (
          <p>Loading Item List...</p>
        ) : foodList && foodList.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {foodList.map((food, index) => (
              <div
                key={index}
                className="p-4 pb-2 flex flex-col gap-2 dark:bg-primary_dark bg-white rounded-md shadow-md shadow-vll_gray dark:shadow-none"
              >
                <Link
                  href={`/station/${params.stationId}/${params.stationName}/menu/${params.menuId}/${params.menuName}/items/${food.id}/${food.name}`}
                >
                  <Image
                    src={food.image || ""}
                    alt="menu icon"
                    width={100}
                    height={100}
                    className="w-32 h-32"
                  />
                </Link>
                <div className="flex justify-between">
                  <h2 className="text-primary_text dark:text-secondary_text font-normal text-sm capitalize">
                    {food.name}
                  </h2>
                  {/* <Link
                    href={`/station/${params.stationId}/${params.stationName}/menu/update`}
                  >
                    <CiEdit
                      size={23}
                      className="text-primary_text dark:text-white"
                    />
                  </Link> */}
                </div>
              </div>
            ))}
          </div>
        ) : foodList.length <= 0 ? (
          <p>No items found! Add new items.</p>
        ) : (
          <p>Couldn&apos;t load food items!</p>
        )}
      </div>
    </div>
  );
};

export default Page;
