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
import { StationData } from "@/types/types";
import { Open_Sans } from "next/font/google";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { clearStationData } from "@/lib/store/features/station/stationSlice";
import { useStationList } from "@/lib/react-query/queriesAndMutations";
import { RootState } from "@/lib/store/store";
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

  const { data: stations, isLoading: isLoading } = useStationList();

  useEffect(() => {
    dispatch(clearStationData());
  }, [dispatch]);

  return (
    <div
      className={` bg-white dark:bg-secondary_dark rounded-sm sm:p-6 p-4 flex flex-col gap-6 shadow-sm shadow-vll_gray dark:shadow-none ${open_sans.className}`}
    >
      <div className="flex sm:flex-row flex-col justify-between">
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
              <BreadcrumbPage className="sm:text-xl text-sm font-medium text-primary_text dark:text-sidebar_blue">
                Station List
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Link
          href={"/station/create"}
          className="bg-primary_text dark:bg-btn_blue text-white text-sm hover:bg-l_orange dark:hover:bg-blue py-1 px-4 rounded place-self-end"
        >
          Add Station
        </Link>
      </div>
      <div className="">
        {isLoading ? (
          <p>Loading Station List...</p>
        ) : stations && stations.length > 0 ? (
          <div className="overflow-x-auto">
            <ScrollArea
              className={`${
                sidebar
                  ? "h-[75vh] xl:w-[76vw] lg:w-[70vw] w-[85vw]"
                  : "h-[75vh] w-[88vw]"
              }`}
            >
              <Table className="">
                <TableCaption></TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Id</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Restaurant</TableHead>
                  </TableRow>
                </TableHeader>
                {stations && stations.length > 0 ? (
                  <TableBody>
                    {stations.map((station: StationData) => {
                      return (
                        <TableRow key={station.id} className="">
                          <TableCell>
                            <Link
                              href={`/station/${station.id}/${station.name}`}
                              className="hover:text-primary_text dark:hover:text-sidebar_blue"
                            >
                              {station.name}
                            </Link>
                          </TableCell>
                          <TableCell>{station.id}</TableCell>
                          <TableCell>{station.address}</TableCell>
                          <TableCell>{station.email}</TableCell>
                          <TableCell>{station.contact_no}</TableCell>
                          <TableCell>{station.user || "Null"}</TableCell>
                          <TableCell>{station.restaurant || "Null"}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                ) : (
                  <div className="text-base font-normal text-center pt-12">
                    Couldn&apos;t fetch station list
                  </div>
                )}
              </Table>
            </ScrollArea>
          </div>
        ) : stations?.length <= 0 ? (
          <p>No stations found!</p>
        ) : (
          <p>Couldn&apos;t load station list!</p>
        )}
      </div>
    </div>
  );
};

export default Page;
