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
import { AiOutlineDelete } from "react-icons/ai";
import axios from "axios";
import toast from "react-hot-toast";

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

  const deleteMenu = async (menuId: string) => {
    axios
      .delete(
        `https://api.morefood.se/api/moreclub/user/menus/${menuId}/${params.restroId}/`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
          },
        }
      )
      .then((response) => {
        console.log("Successfully Deleted menu", response);
        toast.success("Successfully Deleted menu", {
          duration: 5000,
          position: "top-right",
        });
      })
      .catch((error) => {
        console.log("Error Deleting menu", error);
        toast.error("Error Deleting Menu", {
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
                <div className="relative">
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
                  <button
                    className="absolute right-0 top-0 bg-white p-1 rounded-tr-md rounded-bl-md "
                    onClick={() => {
                      deleteMenu(menu.id);
                    }}
                  >
                    <AiOutlineDelete size="20" color="red" />
                  </button>
                </div>
                <div className="flex justify-between px-2 pb-4">
                  <Link
                    href={`/restaurant/${params.restroId}/${params.restroName}/menu/${menu.id}/${menu.name}/items`}
                    className="text-primary_text dark:text-sidebar_blue font-semibold place-self-center text-sm capitalize"
                  >
                    {menu.name}
                  </Link>
                  <Link
                    href={`/restaurant/${params.restroId}/${params.restroName}/menu/${menu.id}/${menu.name}/items`}
                    className="text-primary_text dark:text-sidebar_blue font-medium place-self-center text-sm capitalize"
                  >
                    {menu.no_of_items} items
                  </Link>
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
