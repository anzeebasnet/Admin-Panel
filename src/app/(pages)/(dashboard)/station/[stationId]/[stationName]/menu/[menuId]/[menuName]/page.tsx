"use client";

import { axiosPrivate } from "@/axios/axios";
import { setMenuItem } from "@/lib/store/features/menu/menuSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { RootState } from "@/lib/store/store";
import { MenuItem, StationData } from "@/types/types";
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
  };
}) => {
  const MenuName = decodeURIComponent(params.menuName);
  const menuData = useAppSelector((state: RootState) => state.menu.currentMenu);
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const [menuList, setMenuList] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [menuDetails, setMenuDetails] = useState<MenuItem | null>(null);

  const fetchMenuList = async () => {
    if (!session?.accessToken) return;

    try {
      const res = await axiosPrivate.get(
        "https://api.morefood.se/api/moreclub/station/a0d2264b-e410-4968-84ba-04010a7c344f/menu/",
        {
          headers: {
            Authorization: `Bearer ${
              session?.accessToken || session?.user?.token
            }`,
          },
        }
      );
      console.log(res.data.data);
      setMenuList(res.data.data);
    } catch (error) {
      console.log("Error fetching Menu List");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchMenuList();
    }
  }, [session, params.menuId, dispatch]);

  useEffect(() => {
    if (menuList.length > 0) {
      const matchedData = getMenuDetails(params.menuId);
      if (matchedData) {
        setMenuDetails(matchedData);
      }
    }
  }, [menuList, params.menuId]);

  useEffect(() => {
    if (menuDetails) {
      dispatch(setMenuItem(menuDetails));
    }
  }, [menuDetails, dispatch]);

  function getMenuDetails(menuId: string) {
    return menuList.find((menu) => menu.id === menuId) || null;
  }

  return (
    <div
      className={` bg-white dark:bg-secondary_dark rounded-sm p-6 flex flex-col gap-6 shadow-sm shadow-vll_gray dark:shadow-none ${open_sans.className}`}
    >
      <div className="flex sm:flex-row flex-col justify-between">
        <h1
          className={`text-primary_text dark:text-secondary_text text-lg font-medium ${open_sans.className}`}
        >
          Menu Details
        </h1>
      </div>

      <div className="flex flex-col gap-3">
        <Image
          src={menuData?.icon || ""}
          alt="menu icon"
          width={200}
          height={200}
          className="rounded"
        />
        <div>
          <h3 className="font-medium text-base ">{MenuName}</h3>
          <h3 className="font-medium text-sm">Menu ID: {params.menuId}</h3>
          <h3 className="font-medium text-sm">
            Number of Items: {menuData?.no_of_items}
          </h3>
        </div>
        <div className="flex gap-4">
          {menuData ? (
            <div>
              <Link
                href={`/station/${params.stationId}/${params.stationName}/menu/create`}
                className="bg-primary_text dark:bg-btn_blue text-white text-sm hover:bg-l_orange dark:hover:bg-blue py-1 px-4 rounded place-self-end"
              >
                Edit Menu
              </Link>
            </div>
          ) : (
            ""
          )}
          <div>
            <Link
              href={`/station/${params.stationId}/${params.stationName}/menu/${params.menuId}/${params.menuName}/items`}
              className="bg-primary_text dark:bg-btn_blue text-white text-sm hover:bg-l_orange dark:hover:bg-blue py-1 px-4 rounded place-self-end"
            >
              View Items
            </Link>
          </div>
        </div>
        {/* <div>
          <h2>Store Value</h2>
          {menuData ? (
            <div>
              <p>{menuData?.id}</p>
              <p>{menuData?.name}</p>
              <p>{menuData?.no_of_items}</p>
              <Image
                src={menuData.icon || ""}
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
            {menuDetails ? (
              <div>
                <p>{menuDetails?.id}</p>
                <p>{menuDetails?.name}</p>
                <p>{menuDetails?.no_of_items}</p>
                <Image
                  src={menuDetails.icon || ""}
                  alt="banner"
                  width={200}
                  height={200}
                />
              </div>
            ) : (
              <p>Detail unavailable.</p>
            )}
          </div>
        )} */}
      </div>
    </div>
  );
};

export default Page;
