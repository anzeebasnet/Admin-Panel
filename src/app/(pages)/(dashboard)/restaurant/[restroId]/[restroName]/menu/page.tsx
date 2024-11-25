"use client";

import {
  useMenuList,
  useRestroMenuList,
} from "@/lib/react-query/queriesAndMutations";
import {
  clearMenuItem,
  setMenuItem,
} from "@/lib/store/features/menu/menuSlice";
import { useAppDispatch } from "@/lib/store/hooks";
import { MenuItem, RestroMenuList } from "@/types/types";
import { Open_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import { HiPlusSmall } from "react-icons/hi2";
import { CiEdit } from "react-icons/ci";

const open_sans = Open_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const Page = ({
  params,
}: {
  params: { restroId: string; restroName: string };
}) => {
  const dispatch = useAppDispatch();

  const { data: restroMenuList, isLoading: isLoading } = useRestroMenuList(
    params.restroId
  );

  useEffect(() => {
    dispatch(clearMenuItem());
  }, [dispatch]);

  return (
    <div
      className={` bg-white dark:bg-secondary_dark rounded-sm p-6 flex flex-col gap-6 shadow-sm shadow-vll_gray dark:shadow-none ${open_sans.className}`}
    >
      <div className="flex sm:flex-row flex-col sm:justify-between sm:gap-0 gap-4">
        <h1
          className={`text-primary_text dark:text-secondary_text text-lg font-medium ${open_sans.className}`}
        >
          Restaurant Menu List
        </h1>
        <div className="flex gap-4">
          <Link
            href={`/restaurant/${params.restroId}/${params.restroName}/menu/create`}
            className="bg-primary_text dark:bg-btn_blue text-white text-sm hover:bg-l_orange dark:hover:bg-blue py-1 px-4 rounded place-self-end"
          >
            <div className="flex gap-1 items-center">
              Create New Menu <HiPlusSmall size={23} />
            </div>
          </Link>
        </div>
      </div>
      <div>
        {isLoading ? (
          <p>Loading Menu List...</p>
        ) : restroMenuList && restroMenuList.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {restroMenuList.map((menu: RestroMenuList, index: any) => (
              <div
                key={index}
                className="flex flex-col gap-2 dark:bg-primary_dark rounded-md bg-white shadow-md shadow-vll_gray dark:shadow-none"
              >
                <Link
                  href={`/restaurant/${params.restroId}/${params.restroName}/menu/${menu.id}/${menu.name}/items`}
                >
                  <Image
                    src={menu.icon || ""}
                    alt="menu icon"
                    width={100}
                    height={100}
                    className="w-40 h-32 rounded-t-md"
                  />
                </Link>
                <div className="flex justify-between px-2 pb-4">
                  <Link
                    href={`/restaurant/${params.restroId}/${params.restroName}/menu/${menu.id}/${menu.name}/items`}
                    className="text-primary_text dark:text-secondary_text font-semibold place-self-center text-sm capitalize"
                  >
                    {menu.name}
                  </Link>
                  <Link
                    href={`/restaurant/${params.restroId}/${params.restroName}/menu/${menu.id}/${menu.name}/items`}
                    className="text-primary_text dark:text-secondary_text font-medium place-self-center text-sm capitalize"
                  >
                    {menu.no_of_items} items
                  </Link>
                  {/* <Link
                    href={`/restaurant/${params.restroId}/${params.restroName}/menu/create`}
                    onClick={() => {
                      dispatch(setMenuItem(menu));
                    }}
                  >
                    <CiEdit
                      size={23}
                      className="text-primary_text dark:text-secondary_text"
                    />
                  </Link> */}
                </div>
              </div>
            ))}
          </div>
        ) : restroMenuList.length <= 0 ? (
          <p>No menus found. Add new menu!</p>
        ) : (
          <p>Couldn&apos;t load menu list</p>
        )}
      </div>
    </div>
  );
};

export default Page;
