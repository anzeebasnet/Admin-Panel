"use client";

import { useFoodItemList } from "@/lib/react-query/queriesAndMutations";
import {
  clearFoodItem,
  setFoodItem,
} from "@/lib/store/features/foodItem/foodItemSlice";
import { useAppDispatch } from "@/lib/store/hooks";
import { FoodItem } from "@/types/types";
import axios from "axios";
import { Open_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { AiOutlineDelete } from "react-icons/ai";
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
  const dispatch = useAppDispatch();
  const { data: foodList, isLoading: isLoading } = useFoodItemList(
    params.stationId,
    params.menuId
  );

  useEffect(() => {
    dispatch(clearFoodItem());
  }, [dispatch]);

  const deleteItem = async (foodId: string) => {
    axios
      .delete(
        `https://api.morefood.se/api/moreclub/station/${params.stationId}/${params.menuId}/${foodId}/food-items/`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
          },
        }
      )
      .then((response) => {
        console.log("Deleted item", response);
        toast.success("Deleted Item!", {
          duration: 5000,
          position: "top-right",
        });
      })
      .catch((error) => {
        console.log("Error deleting item", error);
        toast.error("Error deleting item!", {
          duration: 5000,
          position: "top-right",
        });
      });
  };

  return (
    <div
      className={` bg-white dark:bg-secondary_dark rounded-sm p-6 flex flex-col gap-6 shadow-sm shadow-vll_gray dark:shadow-none ${open_sans.className}`}
    >
      <div className="flex sm:flex-row flex-col sm:justify-between sm:gap-0 gap-4">
        <h1
          className={`text-primary_text dark:text-sidebar_blue text-lg font-medium ${open_sans.className}`}
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
          <p>Loading Food Item List...</p>
        ) : foodList && foodList?.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {foodList.map((food: FoodItem, index: any) => (
              <div
                key={index}
                className="flex flex-col gap-2 dark:bg-primary_dark bg-white rounded-md shadow-md shadow-vll_gray dark:shadow-none"
              >
                <div className="relative">
                  <Link
                    href={`/station/${params.stationId}/${params.stationName}/menu/${params.menuId}/${params.menuName}/items/${food.id}/${food.name}`}
                  >
                    <Image
                      src={food.image || ""}
                      alt="menu icon"
                      width={100}
                      height={100}
                      className="w-40 h-32 rounded-t-md"
                    />
                  </Link>
                  <button
                    className="absolute right-0 top-0 bg-white p-1 rounded-tr-md "
                    onClick={() => {
                      deleteItem(food.id);
                    }}
                  >
                    <AiOutlineDelete size={22} color="red" />
                  </button>
                </div>
                <div className="flex justify-between px-2  pb-4">
                  <h2 className="text-primary_text dark:text-sidebar_blue font-medium place-self-center text-sm capitalize">
                    {food.name}
                  </h2>
                  <Link
                    href={`/station/${params.stationId}/${params.stationName}/menu/${params.menuId}/${params.menuName}/items/create`}
                    onClick={() => {
                      dispatch(setFoodItem(food));
                    }}
                    className=""
                  >
                    <CiEdit size={22} className="text-primary_text " />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : foodList?.length <= 0 ? (
          <p>No items found! Add new items.</p>
        ) : (
          <p>Couldn&apos;t load food items!</p>
        )}
      </div>
    </div>
  );
};

export default Page;
