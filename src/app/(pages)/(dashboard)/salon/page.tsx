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
import { RestroListData, SalonType } from "@/types/types";
import { Open_Sans } from "next/font/google";
import Link from "next/link";
import React, { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { clearStationData } from "@/lib/store/features/station/stationSlice";
import { useSalonList } from "@/lib/react-query/queriesAndMutations";
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
import { Skeleton } from "@/components/ui/skeleton";

const open_sans = Open_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const Page = () => {
  const dispatch = useAppDispatch();
  const sidebar = useAppSelector(
    (state: RootState) => state.collapsible.collapse
  );

  const { data: salonList, isLoading: isloading } = useSalonList();

  useEffect(() => {
    dispatch(clearStationData());
  }, [dispatch]);

  return (
    <div
      className={` bg-white dark:bg-secondary_dark rounded-sm sm:p-6 p-4 flex flex-col gap-6 shadow-sm shadow-vll_gray dark:shadow-none ${open_sans.className}`}
    >
      <div className="flex sm:flex-row flex-col gap-y-2 sm:justify-between">
        <Breadcrumb>
          <BreadcrumbList className="flex sm:gap-1">
            <BreadcrumbItem>
              <BreadcrumbLink href={`/`}>
                <CgArrowLeft
                  className="text-primary_text dark:text-sidebar_blue"
                  size={25}
                />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage className="sm:text-xl text-sm font-medium text-primary_text dark:text-sidebar_blue">
                Salons
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Link
          href={"/salon/create"}
          className="bg-primary_text dark:bg-btn_blue text-white text-sm hover:bg-l_orange dark:hover:bg-blue py-1 px-4 rounded place-self-end"
        >
          Add Salon
        </Link>
      </div>
      <div className="">
        <div className="overflow-x-auto">
          <ScrollArea
            className={`${
              sidebar
                ? "sm:h-[75vh] h-[68vh] xl:w-[75vw] lg:w-[70vw] w-[85vw]"
                : "h-[70vh] w-[85vw]"
            }`}
          >
            <Table className="">
              <TableCaption></TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Id</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Contact</TableHead>
                </TableRow>
              </TableHeader>
              {isloading ? (
                <TableBody>
                  {Array.from({ length: 10 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="h-4 w-full bg-gray-200" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-full bg-gray-200" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-full bg-gray-200" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-full bg-gray-200" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              ) : salonList && salonList.length > 0 ? (
                <TableBody>
                  {salonList.map((salon: SalonType) => {
                    return (
                      <TableRow key={salon.id} className="">
                        <TableCell>
                          <Link
                            href={`/salon/${salon.id}/${salon.name}`}
                            className="hover:text-primary_text dark:hover:text-sidebar_blue"
                          >
                            {salon.name}
                          </Link>
                        </TableCell>
                        <TableCell>{salon.id}</TableCell>
                        <TableCell>{salon.address}</TableCell>
                        <TableCell>{salon.contact_no}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              ) : salonList?.length <= 0 ? (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      There are no salons at the moment. Add some salons!
                    </TableCell>
                  </TableRow>
                </TableBody>
              ) : (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      Couldn&apos;t fetch salon list
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default Page;
