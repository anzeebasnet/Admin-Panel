"use client";

import { useRestroMenuList } from "@/lib/react-query/queriesAndMutations";
import { clearMenuItem } from "@/lib/store/features/menu/menuSlice";
import { useAppDispatch } from "@/lib/store/hooks";
import { RestroMenuList } from "@/types/types";
import { Open_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { HiPlusSmall } from "react-icons/hi2";
import { AiOutlineDelete } from "react-icons/ai";
import toast from "react-hot-toast";
import useAxiosPrivateFood from "@/hooks/useAxiosPrivateFood";
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
  params: { restroId: string; restroName: string };
}) => {
  const dispatch = useAppDispatch();
  const axiosInstance = useAxiosPrivateFood();
  const RestroName = decodeURIComponent(params.restroName);
  const [deletingMenu, setDeletingMenu] = useState<RestroMenuList | null>(null);
  const { data: restroMenuList, isLoading: isLoading } = useRestroMenuList(
    params.restroId
  );

  useEffect(() => {
    dispatch(clearMenuItem());
  }, [dispatch]);

  const deleteMenu = async (menu: RestroMenuList, menuId: string) => {
    setDeletingMenu(menu);
    axiosInstance
      .delete(`/moreclub/user/menus/${menuId}/${params.restroId}/`)
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
      })
      .finally(() => {
        setDeletingMenu(null);
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
                href={`/restaurant/${params.restroId}/${params.restroName}/`}
              >
                <CgArrowLeft
                  className="text-primary_text dark:text-sidebar_blue"
                  size={25}
                />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage className="sm:text-xl text-sm font-medium text-primary_text dark:text-sidebar_blue">
                {RestroName} Menu
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

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
      <div className="">
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
                    className="absolute right-0 top-0 bg-red-500 text-white hover:bg-white hover:text-red-500  p-1 rounded-tr-md rounded-bl-md "
                    onClick={() => {
                      deleteMenu(menu, menu.id);
                    }}
                  >
                    <AiOutlineDelete size="20" className="" />
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
                {deletingMenu ? (
                  <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-25 flex justify-center items-center z-50">
                    <div className="bg-white sm:p-8 p-4 rounded shadow-lg lg:w-[30vw] sm:w-[50vw] w-[96vw] flex flex-col gap-2 items-center justify-center">
                      <DialogLoader />
                      <p className="text-black font-normal text-base">
                        Deleting {deletingMenu.name}...
                      </p>
                      <button
                        onClick={() => {
                          setDeletingMenu(null);
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
        ) : restroMenuList?.length <= 0 ? (
          <p>No menus found. Add new menu!</p>
        ) : (
          <p>Couldn&apos;t load menu list</p>
        )}
      </div>
    </div>
  );
};

export default Page;
