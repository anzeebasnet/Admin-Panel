"use client";

import useAxiosPrivateFood from "@/hooks/useAxiosPrivateFood";
import { useStationMenu } from "@/lib/react-query/queriesAndMutations";
import {
  clearNearbyItem,
  setNearbyItem,
} from "@/lib/store/features/nearbyItem/nearbyItemSlice";
import { NearbyStationMenuItem } from "@/types/types";
import axios from "axios";
import { PencilLine, Plus } from "lucide-react";
import { Open_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineDelete } from "react-icons/ai";
import { CiEdit } from "react-icons/ci";
import { useDispatch } from "react-redux";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CgArrowLeft } from "react-icons/cg";
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
    stationId: string;
    stationName: string;
  };
}) => {
  const dispatch = useDispatch();
  const StationName = decodeURIComponent(params.stationName);
  const axiosInstance = useAxiosPrivateFood();
  const [deletingMenuItem, setDeletingMenuItem] =
    useState<NearbyStationMenuItem | null>(null);
  const { data: menuItems, isLoading: isLoading } = useStationMenu(
    params.restroId,
    params.stationId
  );

  useEffect(() => {
    dispatch(clearNearbyItem());
  }, []);

  const deleteItem = (food: NearbyStationMenuItem, foodId: string) => {
    setDeletingMenuItem(food);
    axiosInstance
      .delete(
        `/moreclub/station/${params.stationId}/${params.restroId}/${foodId}/food-items/restro/update/`
      )
      .then((response) => {
        console.log("Deleted Item", response);
        toast.success("Deleted Item!", {
          duration: 5000,
          position: "top-right",
        });
      })
      .catch((error) => {
        console.log("Error Deleting Item", error);
        toast.error("Error Deleting Item", {
          duration: 5000,
          position: "top-right",
        });
      })
      .finally(() => {
        setDeletingMenuItem(null);
      });
  };

  return (
    <div
      className={` bg-white dark:bg-secondary_dark rounded-sm p-6 flex flex-col gap-6 shadow-sm shadow-vll_gray dark:shadow-none ${open_sans.className}`}
    >
      <div className="flex sm:flex-row flex-col sm:justify-between sm:gap-0 gap-4">
        <Breadcrumb className="mb-4 -ml-1">
          <BreadcrumbList className="flex sm:gap-1">
            <BreadcrumbItem>
              <BreadcrumbLink
                href={`/restaurant/${params.restroId}/${params.restroName}/nearbyStation/${params.stationId}/${params.stationName}/`}
              >
                <CgArrowLeft
                  className="text-primary_text dark:text-sidebar_blue"
                  size={25}
                />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage className="sm:text-xl text-sm font-medium text-primary_text dark:text-sidebar_blue">
                {StationName} Menu
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex gap-4">
          <Link
            href={`/restaurant/${params.restroId}/${params.restroName}/nearbyStation/${params.stationId}/${params.stationName}/my-menu/create`}
            className="bg-primary_text dark:bg-btn_blue text-white text-sm hover:bg-l_orange dark:hover:bg-blue py-1 px-4 rounded place-self-end"
          >
            <div className="flex gap-1 items-center">
              Add New Item <Plus size={23} />
            </div>
          </Link>
        </div>
      </div>
      <div className="">
        {isLoading ? (
          <p>Loading Food Item List...</p>
        ) : menuItems && menuItems.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {menuItems.map((food: NearbyStationMenuItem, index: any) => (
              <div
                key={index}
                className="flex flex-col gap-2 pb-4 w-48 dark:bg-primary_dark bg-white rounded-md shadow-md shadow-vll_gray dark:shadow-none"
              >
                <div className="relative">
                  <Image
                    src={food.image || ""}
                    alt="menu icon"
                    width={100}
                    height={100}
                    className="w-48 h-32 rounded-t-md"
                  />
                  <button
                    className="absolute right-0 top-0 bg-red-500 text-white hover:bg-white hover:text-red-500 p-1 rounded-tr-md rounded-bl-md "
                    onClick={() => {
                      deleteItem(food, food.id);
                    }}
                  >
                    <AiOutlineDelete size="20" />
                  </button>
                </div>
                <div className="flex flex-col gap-1  px-2">
                  <div className="flex justify-between items-end">
                    <h2 className="text-black dark:text-sidebar_blue font-medium  text-base capitalize line-clamp-1">
                      {food.name}
                    </h2>
                    <Link
                      href={`/restaurant/${params.restroId}/${params.restroName}/nearbyStation/${params.stationId}/${params.stationName}/my-menu/create`}
                      onClick={() => {
                        dispatch(setNearbyItem(food));
                      }}
                    >
                      <PencilLine
                        size={20}
                        className="text-primary_text dark:text-sidebar_blue"
                      />
                    </Link>
                  </div>
                  <div className="flex items-center gap-1">
                    <p className="text-primary_text dark:text-sidebar_blue font-medium  text-sm">
                      Rs. {food.item_price}
                    </p>
                    {food.discount_percentage ? (
                      <p className="text-primary_text dark:text-sidebar_blue font-medium  text-xs line-through">
                        Rs. {food.actual_price}
                      </p>
                    ) : (
                      ""
                    )}
                    {food.discount_percentage ? (
                      <div className="text-primary_text dark:text-sidebar_blue font-medium place-self-start text-sm flex ">
                        <div>{food.discount_percentage}%</div> <p>off</p>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                {deletingMenuItem ? (
                  <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-25 flex justify-center items-center z-50">
                    <div className="bg-white sm:p-8 p-4 rounded shadow-lg lg:w-[30vw] sm:w-[50vw] w-[96vw] flex flex-col gap-2 items-center justify-center">
                      <DialogLoader />
                      <p className="text-black font-normal text-base">
                        Deleting {deletingMenuItem.name}...
                      </p>
                      <button
                        onClick={() => {
                          setDeletingMenuItem(null);
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
        ) : menuItems?.length <= 0 ? (
          <p>No items found! Add new items.</p>
        ) : (
          <p>Couldn&apos;t load food items!</p>
        )}
      </div>
    </div>
  );
};

export default Page;

// https://api.morefood.se/api/moreclub/station/512bf3ee-8d0d-4891-818d-c4e7416c682a/a3033826-214a-46d9-a249-b01622ce1419/2eeeb6bc-2957-4fd9-be4e-0a507663b060/food-items/restro/update/
// "data": [
//   {
//       "id": "2eeeb6bc-2957-4fd9-be4e-0a507663b060",
//       "name": "Cinnamon Roll",
//       "menu": "BreakFast",
//       "image": "https://res.cloudinary.com/duehpgb6o/image/upload/v1/media/food_item/cinnamonRoll_vstbts",
//       "short_description": "Flour, cinnamon, sugar, butter",
//       "retailer_price": "300.00",
//       "is_active": false,
//       "actual_price": 0.0,
//       "discount_percentage": null,
//       "currency_symbol": "Rs",
//       "item_price": 0.0,
//       "ingredient": "Flour, cinnamon, sugar, butter"
//   },
//   {
//       "id": "328958ed-c6dc-4d06-b8f3-fdb15d46fe68",
//       "name": "Pepperoni Pizza",
//       "menu": "Lunch Box",
//       "image": "https://res.cloudinary.com/duehpgb6o/image/upload/v1/media/food_item/medium_Ppzza_fqy7nl",
//       "short_description": "Flour, yeast, pizza sauce, cheese, pepperoni",
//       "retailer_price": "400.00",
//       "is_active": true,
//       "actual_price": 600.0,
//       "discount_percentage": null,
//       "currency_symbol": "Rs",
//       "item_price": 600.0,
//       "ingredient": "Flour, yeast, pizza sauce, cheese, pepperoni"
//   }
// ],
// "errors": {},
// "meta": {}
// }
