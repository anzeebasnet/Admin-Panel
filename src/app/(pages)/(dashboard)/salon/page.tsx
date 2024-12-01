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
        <h1
          className={`text-primary_text dark:text-sidebar_blue text-lg font-medium ${open_sans.className}`}
        >
          Salon List
        </h1>
        <Link
          href={"/salon/create"}
          className="bg-primary_text dark:bg-btn_blue text-white text-sm hover:bg-l_orange dark:hover:bg-blue py-1 px-4 rounded place-self-end"
        >
          Add Salon
        </Link>
      </div>
      {isloading ? (
        <p>Loading Salon List...</p>
      ) : salonList && salonList.length > 0 ? (
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
                  <TableHead>Contact</TableHead>
                </TableRow>
              </TableHeader>
              {salonList && salonList.length > 0 ? (
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
              ) : (
                <div className="text-base font-normal text-center pt-12">
                  Couldn&apos;t fetch salon list
                </div>
              )}
            </Table>
          </ScrollArea>
        </div>
      ) : salonList?.length <= 0 ? (
        <p>No salon found!</p>
      ) : (
        <p>Couldn&apos;t load salon list!</p>
      )}
    </div>
  );
};

export default Page;
