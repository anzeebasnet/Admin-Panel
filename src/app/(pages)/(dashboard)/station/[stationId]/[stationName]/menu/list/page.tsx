"use client";

import { useMenuList } from "@/lib/react-query/queriesAndMutations";
import {
  clearMenuItem,
  setMenuItem,
} from "@/lib/store/features/menu/menuSlice";
import { useAppDispatch } from "@/lib/store/hooks";
import { MenuItem } from "@/types/types";
import { Open_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { HiPlusSmall } from "react-icons/hi2";
import { CiEdit } from "react-icons/ci";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CgArrowLeft } from "react-icons/cg";

const open_sans = Open_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const Page = ({
  params,
}: {
  params: { stationId: string; stationName: string };
}) => {
  const dispatch = useAppDispatch();
  const StationName = decodeURIComponent(params.stationName);
  const { data: menuList, isLoading: isLoading } = useMenuList(
    params.stationId
  );

  return (
    <div
      className={` bg-white dark:bg-secondary_dark rounded-sm p-6 flex flex-col gap-6 shadow-sm shadow-vll_gray dark:shadow-none ${open_sans.className}`}
    >
      <div className="flex sm:flex-row flex-col sm:justify-between sm:gap-0 gap-4">
        <Breadcrumb className="-ml-1">
          <BreadcrumbList className="flex sm:gap-1">
            <BreadcrumbItem>
              <BreadcrumbLink
                href={`/station/${params.stationId}/${params.stationName}/`}
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
          <button
            onClick={() => {
              window.location.href = `/station/${params.stationId}/${params.stationName}/menu/list?createMenu=true`;
              dispatch(clearMenuItem());
            }}
            className="bg-primary_text dark:bg-btn_blue text-white text-sm hover:bg-l_orange dark:hover:bg-blue py-1 px-4 rounded place-self-end"
          >
            <div className="flex gap-1 items-center">
              Add New Menu <HiPlusSmall size={23} />
            </div>
          </button>
        </div>
      </div>
      <div className="">
        {isLoading ? (
          <p>Loading Menu List...</p>
        ) : menuList && menuList.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {menuList.map((menu: MenuItem, index: any) => (
              <div
                key={index}
                className="flex flex-col gap-2 dark:bg-primary_dark rounded-md bg-white shadow-md shadow-vll_gray dark:shadow-none w-40"
              >
                <Link
                  href={`/station/${params.stationId}/${params.stationName}/menu/${menu.id}/${menu.name}/items`}
                >
                  <Image
                    src={menu.icon || ""}
                    alt="menu icon"
                    width={100}
                    height={100}
                    className="w-40 h-32 rounded-t-md"
                  />
                </Link>
                <div className="flex flex-col gap-1 px-2 pb-4">
                  <div className="flex gap-1 justify-between ">
                    <Link
                      href={`/station/${params.stationId}/${params.stationName}/menu/${menu.id}/${menu.name}/items`}
                      className="text-primary_text dark:text-sidebar_blue font-medium place-self-center text-sm capitalize line-clamp-1"
                    >
                      {menu.name}
                    </Link>
                    <Link
                      href={`/station/${params.stationId}/${params.stationName}/menu/list?createMenu=true`}
                      onClick={() => {
                        dispatch(setMenuItem(menu));
                      }}
                    >
                      <CiEdit
                        size={23}
                        className="text-primary_text dark:text-sidebar_blue"
                      />
                    </Link>
                  </div>
                  <Link
                    href={`/station/${params.stationId}/${params.stationName}/menu/${menu.id}/${menu.name}/items`}
                    className="text-sm font-medium hover:underline"
                  >
                    {menu.no_of_items} items
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : menuList?.length <= 0 ? (
          <p>No menus found. Add new menu!</p>
        ) : (
          <p>Couldnot load menu list</p>
        )}
      </div>
    </div>
  );
};

export default Page;