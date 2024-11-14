"use client";

import { axiosPrivate } from "@/axios/axios";
import { setFoodItem } from "@/lib/store/features/foodItem/foodItemSlice";
import { setMenuItem } from "@/lib/store/features/menu/menuSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { RootState } from "@/lib/store/store";
import { FoodItem, MenuItem, StationData } from "@/types/types";
import { useSession } from "next-auth/react";
import { Open_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

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
    itemId: string;
    itemName: string;
  };
}) => {
  const MenuName = decodeURIComponent(params.menuName);
  const itemData = useAppSelector(
    (state: RootState) => state.foodItem.currentFoodItems
  );
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const [foodList, setFoodList] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [foodDetails, setFoodDetails] = useState<FoodItem | null>(null);

  const fetchItemList = async () => {
    if (!session?.accessToken) return;

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
      console.log("Error fetching Food List");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchItemList();
    }
  }, [session, params.itemId, dispatch]);

  useEffect(() => {
    if (foodList.length > 0) {
      const matchedData = getFoodDetails(params.itemId);
      if (matchedData) {
        setFoodDetails(matchedData);
      }
    }
  }, [foodList, params.itemId]);

  useEffect(() => {
    if (foodDetails) {
      dispatch(setFoodItem(foodDetails));
    }
  }, [foodDetails, dispatch]);

  function getFoodDetails(itemID: string) {
    return foodList.find((food) => food.id === itemID) || null;
  }

  return (
    <div
      className={` bg-white dark:bg-secondary_dark rounded-sm p-6 flex flex-col gap-6 shadow-sm shadow-vll_gray dark:shadow-none ${open_sans.className}`}
    >
      <div className="flex sm:flex-row flex-col justify-between">
        <h1
          className={`text-primary_text dark:text-secondary_text text-lg font-medium ${open_sans.className}`}
        >
          Item Detail
        </h1>
      </div>

      {isLoading ? (
        <p>Loading Item Details...</p>
      ) : foodDetails ? (
        <div className="flex flex-col gap-3">
          <Image
            src={foodDetails?.image || ""}
            alt="menu icon"
            width={200}
            height={200}
            className="rounded"
          />
          <div>
            <h3 className="font-medium text-base capitalize">
              {foodDetails.name}
            </h3>
            <h3 className="font-medium text-sm">Id: {foodDetails.id}</h3>
            <h3 className="font-medium text-sm">
              Actual Price: {foodDetails?.currency_symbol}.{" "}
              {foodDetails?.actual_price}
            </h3>
            <h3 className="font-medium text-sm">
              Item Price: {foodDetails?.currency_symbol}.{" "}
              {foodDetails?.item_price}
            </h3>
            <h3 className="font-medium text-sm">
              Retailer Price: {foodDetails?.currency_symbol}.{" "}
              {foodDetails?.retailer_price}
            </h3>
            <h3 className="font-medium text-sm">
              Discount Percentage: {foodDetails?.discount_percentage || "0"}
            </h3>
            <h3 className="font-medium text-sm">
              Ingredient: {foodDetails?.ingredient}
            </h3>
            <h3 className="font-medium text-sm">
              Description: {foodDetails?.short_description}
            </h3>
          </div>
          <div className="flex gap-4">
            {itemData ? (
              <div>
                <Link
                  href={`/station/${params.stationId}/${params.stationName}/menu/${params.menuId}/${params.menuName}/items/create`}
                  className="bg-primary_text dark:bg-btn_blue text-white text-sm hover:bg-l_orange dark:hover:bg-blue py-1 px-4 rounded place-self-end"
                >
                  Edit Item
                </Link>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      ) : (
        <p>Couldn&apos;t find menu detail.</p>
      )}
    </div>
  );
};

export default Page;
