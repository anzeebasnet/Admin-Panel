"use client";

import { axiosPrivate } from "@/axios/axios";
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
import { useSession } from "next-auth/react";
import { Open_Sans } from "next/font/google";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppDispatch } from "@/lib/store/hooks";
import { clearStationData } from "@/lib/store/features/station/stationSlice";

const open_sans = Open_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const Page = () => {
  const { data: session } = useSession();
  const [stationList, setStationList] = useState<StationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useAppDispatch();

  const fetchStationList = async () => {
    try {
      const res = await axiosPrivate.get(
        "https://api.morefood.se/api/moreclub/stations/list/",
        {
          headers: {
            Authorization: `Bearer ${
              session?.accessToken || session?.user?.token
            }`,
          },
        }
      );
      console.log(res.data.data);
      setStationList(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Clear the Redux station data when this page loads
    dispatch(clearStationData());
  }, [dispatch]);

  useEffect(() => {
    fetchStationList();
  }, []);

  return (
    <div
      className={` bg-white dark:bg-secondary_dark rounded-sm p-6 flex flex-col gap-6 shadow-sm shadow-vll_gray dark:shadow-none ${open_sans.className}`}
    >
      <div className="flex sm:flex-row flex-col justify-between">
        <h1
          className={`text-primary_text dark:text-secondary_text text-lg font-medium ${open_sans.className}`}
        >
          Station List
        </h1>
        <Link
          href={"/station/create"}
          className="bg-primary_text dark:bg-btn_blue text-white text-sm hover:bg-l_orange dark:hover:bg-blue py-1 px-4 rounded place-self-end"
        >
          Add Station
        </Link>
      </div>
      {isLoading ? (
        <p>Loading Station List...</p>
      ) : stationList && stationList.length > 0 ? (
        <div className="overflow-x-auto">
          <ScrollArea className="h-[75vh] w-[75vw]">
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
              {stationList && stationList.length > 0 ? (
                <TableBody>
                  {stationList.map((station) => {
                    return (
                      <TableRow key={station.id} className="">
                        <TableCell>
                          <Link
                            href={`/station/${station.id}/${station.name}`}
                            className="hover:text-primary_text dark:hover:text-secondary_text"
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
      ) : (
        <p>Couldn&apos;t load station list</p>
      )}
    </div>
  );
};

export default Page;