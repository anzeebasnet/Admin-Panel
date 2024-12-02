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
import { OrderData } from "@/types/types";
import { Open_Sans } from "next/font/google";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { clearStationData } from "@/lib/store/features/station/stationSlice";
import {
  useOrderList,
  useOrderSummary,
  useRestroList,
} from "@/lib/react-query/queriesAndMutations";
import { RootState } from "@/lib/store/store";
import OrderForm from "@/components/Forms/OrderForm";

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
  const sidebar = useAppSelector(
    (state: RootState) => state.collapsible.collapse
  );

  const { data: orderSummary, isLoading: isloading } = useOrderSummary(
    params.restroId
  );

  return (
    <div
      className={` bg-white dark:bg-secondary_dark rounded-sm sm:p-6 p-4 flex flex-col gap-6 shadow-sm shadow-vll_gray dark:shadow-none ${open_sans.className}`}
    >
      <div className="flex sm:flex-row flex-col gap-y-2 sm:justify-between">
        <h1
          className={`text-primary_text dark:text-sidebar_blue text-lg font-medium ${open_sans.className}`}
        >
          Order Summary
        </h1>
      </div>
      {isloading ? (
        <p>Loading...</p>
      ) : orderSummary && orderSummary.order_items.length > 0 ? (
        orderSummary.order_items.map((items, index) => (
          <Table className="" key={index}>
            <TableCaption></TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.food_item_name}</TableCell>
                  <TableCell>{item.total_quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ))
      ) : orderSummary && orderSummary?.order_items?.length <= 0 ? (
        <p>No orders found!</p>
      ) : (
        <p>Couldn&apos;t load order summary!</p>
      )}
    </div>
  );
};

export default Page;
