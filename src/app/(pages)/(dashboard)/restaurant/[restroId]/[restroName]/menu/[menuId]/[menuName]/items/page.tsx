"use client";

import { useRestroItemList } from "@/lib/react-query/queriesAndMutations";
import {
  clearRestroItem,
  setRestroItem,
} from "@/lib/store/features/restroItem/restroItemSlice";
import { useAppDispatch } from "@/lib/store/hooks";
import { RestroFoodItem } from "@/types/types";
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
    restroId: string;
    restroName: string;
    menuId: string;
    menuName: string;
  };
}) => {
  const dispatch = useAppDispatch();
  const { data: foodList, isLoading: isLoading } = useRestroItemList(
    params.restroId,
    params.menuId
  );

  useEffect(() => {
    dispatch(clearRestroItem());
  }, [dispatch]);

  const deleteMenu = async (foodId: string) => {
    axios
      .delete(
        `https://api.morefood.se/api/moreclub/user/food/items/${params.menuId}/${foodId}/${params.restroId}/`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
          },
        }
      )
      .then((response) => {
        console.log("Successfully Deleted food item", response);
        toast.success("Successfully Deleted food item", {
          duration: 5000,
          position: "top-right",
        });
      })
      .catch((error) => {
        console.log("Error Deleting food item", error);
        toast.error("Error Deleting food item", {
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
            href={`/restaurant/${params.restroId}/${params.restroName}/menu/${params.menuId}/${params.menuName}/items/create`}
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
        ) : foodList && foodList.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {foodList.map((food: RestroFoodItem, index: any) => (
              <div
                key={index}
                className="flex flex-col gap-2 pb-4 w-48 dark:bg-primary_dark bg-white rounded-md shadow-md shadow-vll_gray dark:shadow-none"
              >
                <div className="relative">
                  <Link
                    href={`/restaurant/${params.restroId}/${params.restroName}/menu/${params.menuId}/${params.menuName}/items/${food.id}/${food.name}`}
                  >
                    <Image
                      src={food.image || ""}
                      alt="menu icon"
                      width={100}
                      height={100}
                      className="w-48 h-32 rounded-t-md"
                    />
                  </Link>
                  <button
                    className="absolute right-0 top-0 bg-white p-1 rounded-tr-md rounded-bl-md "
                    onClick={() => {
                      deleteMenu(food.id);
                    }}
                  >
                    <AiOutlineDelete size="20" color="red" />
                  </button>
                </div>
                <div className="flex flex-col gap-1  px-2">
                  <div className="flex justify-between items-end">
                    <Link
                      href={`/restaurant/${params.restroId}/${params.restroName}/menu/${params.menuId}/${params.menuName}/items/${food.id}/${food.name}`}
                      className="text-black dark:text-sidebar_blue font-medium  text-base capitalize line-clamp-1"
                    >
                      {food.name}
                    </Link>
                    <Link
                      href={`/restaurant/${params.restroId}/${params.restroName}/menu/${params.menuId}/${params.menuName}/items/create`}
                      onClick={() => {
                        dispatch(setRestroItem(food));
                      }}
                    >
                      <CiEdit
                        size={23}
                        className="text-primary_text dark:text-sidebar_blue"
                      />
                    </Link>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-1">
                      <p className="text-primary_text dark:text-sidebar_blue font-medium  text-sm">
                        Rs. {food.item_price}
                      </p>
                      <p className="text-primary_text dark:text-sidebar_blue font-medium  text-xs line-through">
                        Rs. {food.actual_price}
                      </p>
                    </div>
                    <div className="text-primary_text dark:text-sidebar_blue font-medium place-self-start text-sm flex ">
                      <div>{food.discount_percentage}%</div> <p>off</p>
                    </div>
                  </div>
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
