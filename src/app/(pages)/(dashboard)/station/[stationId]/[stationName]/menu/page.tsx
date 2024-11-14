"use client";

import { useMenuList } from "@/lib/react-query/queriesAndMutations";
import { clearMenuItem } from "@/lib/store/features/menu/menuSlice";
import { useAppDispatch } from "@/lib/store/hooks";
import { MenuItem } from "@/types/types";
import { useSession } from "next-auth/react";
import { Open_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { HiPlusSmall } from "react-icons/hi2";

const open_sans = Open_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const Page = ({
  params,
}: {
  params: { stationId: string; stationName: string };
}) => {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const [menuList, setMenuList] = useState<MenuItem[]>([]);

  const { data: menus, isLoading: isLoading } = useMenuList(
    setMenuList,
    params.stationId
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
          Menu List
        </h1>
        <div className="flex gap-4">
          <Link
            href={`/station/${params.stationId}/${params.stationName}/menu/create`}
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
          <p>Loading Menu List</p>
        ) : menuList && menuList.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {menuList.map((menu, index) => (
              <div
                key={index}
                className="p-4 pb-2 flex flex-col gap-2 dark:bg-primary_dark bg-white rounded-md shadow-md shadow-vll_gray dark:shadow-none"
              >
                <Link
                  href={`/station/${params.stationId}/${params.stationName}/menu/${menu.id}/${menu.name}`}
                >
                  <Image
                    src={menu.icon || ""}
                    alt="menu icon"
                    width={100}
                    height={100}
                    className="w-32 h-32"
                  />
                </Link>
                <div className="flex justify-between">
                  <h2 className="text-primary_text dark:text-secondary_text font-normal text-sm capitalize">
                    {menu.name}
                  </h2>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Couldnot load menu list</p>
        )}
      </div>
    </div>
  );
};

export default Page;
