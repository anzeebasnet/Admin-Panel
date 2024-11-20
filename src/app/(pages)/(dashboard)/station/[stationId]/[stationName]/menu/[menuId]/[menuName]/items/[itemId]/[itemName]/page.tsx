"use client";

import { useFoodItemList } from "@/lib/react-query/queriesAndMutations";
import { setFoodItem } from "@/lib/store/features/foodItem/foodItemSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { RootState } from "@/lib/store/store";
import { FoodItem } from "@/types/types";
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
  const itemData = useAppSelector(
    (state: RootState) => state.foodItem.currentFoodItems
  );
  const dispatch = useAppDispatch();
  const [foodDetails, setFoodDetails] = useState<FoodItem | null>(null);

  const { data: foodItems, isLoading: isLoading } = useFoodItemList(
    params.stationId,
    params.menuId
  );

  //set Food detail
  useEffect(() => {
    if (foodItems.length > 0) {
      const matchedData = getFoodDetails(params.itemId);
      if (matchedData) {
        setFoodDetails(matchedData);
      }
    }
  }, [foodItems, params.itemId]);

  //set food detail in redux for update
  useEffect(() => {
    if (foodDetails) {
      dispatch(setFoodItem(foodDetails));
    }
  }, [foodDetails, dispatch]);

  function getFoodDetails(itemID: string) {
    return foodItems.find((food: FoodItem) => food.id === itemID) || null;
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
      ) : !foodDetails ? (
        <p>Item Detail not found!</p>
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
              Status: {foodDetails.is_active ? "Active" : "Inactive"}
            </h3>
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
        <p>Couldn&apos;t find item detail.</p>
      )}
    </div>
  );
};

export default Page;
