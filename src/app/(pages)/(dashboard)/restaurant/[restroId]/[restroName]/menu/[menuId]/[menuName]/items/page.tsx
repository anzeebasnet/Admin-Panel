"use client";

import useAxiosPrivateFood from "@/hooks/useAxiosPrivateFood";
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
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineDelete } from "react-icons/ai";
import { CiEdit } from "react-icons/ci";
import { HiPlusSmall } from "react-icons/hi2";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CgArrowLeft } from "react-icons/cg";
import { PencilLine } from "lucide-react";
import DialogLoader from "@/components/ui/DialogLoader";

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
  const RestroName = decodeURIComponent(params.restroName);
  const axiosInstance = useAxiosPrivateFood();
  const [deletingItem, setDeletingItem] = useState<RestroFoodItem | null>(null);
  const { data: foodList, isLoading: isLoading } = useRestroItemList(
    params.restroId,
    params.menuId
  );

  useEffect(() => {
    dispatch(clearRestroItem());
  }, [dispatch]);

  const deleteMenu = async (food: RestroFoodItem, foodId: string) => {
    setDeletingItem(food);
    axiosInstance
      .delete(
        `/moreclub/user/food/items/${params.menuId}/${foodId}/${params.restroId}/`
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
      })
      .finally(() => {
        setDeletingItem(null);
      });
  };

  return (
    <div
      className={` bg-white dark:bg-secondary_dark rounded-sm p-6 flex flex-col gap-6 shadow-sm shadow-vll_gray dark:shadow-none ${open_sans.className}`}
    >
      <div className="flex sm:flex-row flex-col sm:justify-between sm:gap-0 gap-4">
        <Breadcrumb className="-ml-1">
          <BreadcrumbList className="flex sm:gap-1">
            <BreadcrumbItem>
              <BreadcrumbLink
                href={`/restaurant/${params.restroId}/${params.restroName}/menu`}
              >
                <CgArrowLeft
                  className="text-primary_text dark:text-sidebar_blue"
                  size={25}
                />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage className="sm:text-xl text-sm font-medium text-primary_text dark:text-sidebar_blue">
                {RestroName} Menu Items
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

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
      <div className="">
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
                    className="absolute right-0 top-0 bg-red-500 text-white hover:bg-white hover:text-red-500 p-1 rounded-tr-md rounded-bl-md "
                    onClick={() => {
                      deleteMenu(food, food.id);
                    }}
                  >
                    <AiOutlineDelete size="20" />
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
                      <PencilLine
                        size={20}
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
                {deletingItem ? (
                  <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-25 flex justify-center items-center z-50">
                    <div className="bg-white sm:p-8 p-4 rounded shadow-lg lg:w-[30vw] sm:w-[50vw] w-[96vw] flex flex-col gap-2 items-center justify-center">
                      <DialogLoader />
                      <p className="text-black font-normal text-base">
                        Deleting {deletingItem.name}...
                      </p>
                      <button
                        onClick={() => {
                          setDeletingItem(null);
                        }}
                        className="bg-red-500 text-white text-sm px-3 py-1 rounded mt-2"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  ""
                )}
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
