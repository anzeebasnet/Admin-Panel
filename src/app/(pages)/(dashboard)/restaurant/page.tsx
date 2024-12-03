"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RestroListData } from "@/types/types";
import { Open_Sans } from "next/font/google";
import Link from "next/link";
import React, { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useRestroList } from "@/lib/react-query/queriesAndMutations";
import { RootState } from "@/lib/store/store";
import { clearRestroData } from "@/lib/store/features/restaurant/restaurantSlice";
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

const Page = () => {
  const dispatch = useAppDispatch();
  const sidebar = useAppSelector(
    (state: RootState) => state.collapsible.collapse
  );

  const { data: restroList, isLoading: isloading } = useRestroList();

  useEffect(() => {
    dispatch(clearRestroData());
  }, [dispatch]);

  return (
    <div
      className={` bg-white dark:bg-secondary_dark rounded-sm sm:p-6 p-4 flex flex-col gap-6 shadow-sm shadow-vll_gray dark:shadow-none ${open_sans.className}`}
    >
      <div className="flex sm:flex-row flex-col gap-y-2 sm:justify-between">
        <Breadcrumb>
          <BreadcrumbList className="flex sm:gap-1">
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                <CgArrowLeft
                  className="text-primary_text dark:text-sidebar_blue"
                  size={25}
                />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage className="sm:text-xl text-lg font-medium text-primary_text dark:text-sidebar_blue">
                Restaurant List
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1
          className={`text-primary_text dark:text-sidebar_blue text-lg font-medium ${open_sans.className}`}
        ></h1>
        <Link
          href={"/restaurant/create"}
          className="bg-primary_text dark:bg-btn_blue text-white text-sm hover:bg-l_orange dark:hover:bg-blue py-1 px-4 rounded place-self-end"
        >
          Add Restaurant
        </Link>
      </div>
      <div className="">
        {isloading ? (
          <p>Loading Restaurant List...</p>
        ) : restroList && restroList.length > 0 ? (
          <div className="overflow-x-auto">
            <ScrollArea
              className={`${
                sidebar
                  ? "h-[75vh] xl:w-[75vw] lg:w-[70vw] w-[90vw]"
                  : "h-[75vh] w-[85vw]"
              }`}
            >
              <Table className="">
                <TableCaption></TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Id</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Opening Hours</TableHead>
                  </TableRow>
                </TableHeader>
                {restroList && restroList.length > 0 ? (
                  <TableBody>
                    {restroList.map((restro: RestroListData) => {
                      return (
                        <TableRow key={restro.id} className="">
                          <TableCell>
                            <Link
                              href={`/restaurant/${restro.id}/${restro.name}`}
                              className="hover:text-primary_text dark:hover:text-sidebar_blue"
                            >
                              {restro.name}
                            </Link>
                          </TableCell>
                          <TableCell>{restro.id}</TableCell>
                          <TableCell>{restro.address}</TableCell>
                          {restro.open_hrs === "Open" ? (
                            <TableCell>Open</TableCell>
                          ) : (
                            <TableCell>Closed</TableCell>
                          )}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                ) : (
                  <div className="text-base font-normal text-center pt-12">
                    Couldn&apos;t fetch restro list
                  </div>
                )}
              </Table>
            </ScrollArea>
          </div>
        ) : restroList?.length <= 0 ? (
          <p>No restaurant found!</p>
        ) : (
          <p>Couldn&apos;t load restaurant list!</p>
        )}
      </div>
    </div>
  );
};

export default Page;
