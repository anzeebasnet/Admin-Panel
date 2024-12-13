"use client";

import { useCuisineList } from "@/lib/react-query/queriesAndMutations";
import { useAppDispatch } from "@/lib/store/hooks";
import { Cuisine } from "@/types/types";
import { Open_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import { HiPlusSmall } from "react-icons/hi2";
import { CiEdit } from "react-icons/ci";
import {
  clearCuisineItem,
  setCuisineItem,
} from "@/lib/store/features/cuisine/CuisineSlice";
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
  params: { restroId: string; restroName: string };
}) => {
  const dispatch = useAppDispatch();
  const { data: cuisines, isLoading: isLoading } = useCuisineList(
    params.restroId
  );

  useEffect(() => {
    dispatch(clearCuisineItem());
  }, [dispatch]);

  return (
    <div
      className={` bg-white dark:bg-secondary_dark rounded-sm p-6 flex flex-col gap-6 shadow-sm shadow-vll_gray dark:shadow-none ${open_sans.className}`}
    >
      <div className="flex sm:flex-row flex-col sm:justify-between sm:gap-0 gap-4">
        <Breadcrumb className="mb-4 -ml-1">
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
              <BreadcrumbPage className="sm:text-xl text-lg font-medium text-primary_text dark:text-sidebar_blue">
                Cuisines
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex gap-4">
          <Link
            href={`/restaurant/${params.restroId}/${params.restroName}/cuisines/create`}
            className="bg-primary_text dark:bg-btn_blue text-white text-sm hover:bg-l_orange dark:hover:bg-blue py-1 px-4 rounded place-self-end"
          >
            <div className="flex gap-1 items-center">
              Add New Cuisine <HiPlusSmall size={23} />
            </div>
          </Link>
        </div>
      </div>
      <div className="">
        {isLoading ? (
          <p>Loading Cuisines...</p>
        ) : cuisines && cuisines.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {cuisines.map((cuisine: Cuisine, index: any) => (
              <div
                key={index}
                className="flex flex-col gap-2 dark:bg-primary_dark rounded-md bg-white shadow-md shadow-vll_gray dark:shadow-none"
              >
                <Image
                  src={cuisine.image || ""}
                  alt="menu icon"
                  width={100}
                  height={100}
                  className="w-40 h-32 rounded-t-md"
                />
                <div className="flex justify-between px-2 pb-4">
                  <h2 className="text-primary_text dark:text-sidebar_blue font-semibold place-self-center text-sm capitalize">
                    {cuisine.name}
                  </h2>
                  <Link
                    href={`/restaurant/${params.restroId}/${params.restroName}/cuisines/create`}
                    onClick={() => {
                      dispatch(setCuisineItem(cuisine));
                    }}
                  >
                    <CiEdit
                      size={23}
                      className="text-primary_text dark:text-sidebar_blue"
                    />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : cuisines?.length <= 0 ? (
          <p>No cuisine found. Add new cuisine!</p>
        ) : (
          <p>Couldn&apos;t load cuisine list!</p>
        )}
      </div>
    </div>
  );
};

export default Page;
