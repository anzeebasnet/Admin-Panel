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
  useRestroList,
} from "@/lib/react-query/queriesAndMutations";
import { RootState } from "@/lib/store/store";
import OrderForm from "@/components/Forms/OrderForm";
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
  const restroName = decodeURIComponent(params.restroName);
  const sidebar = useAppSelector(
    (state: RootState) => state.collapsible.collapse
  );

  const { data: orderList, isLoading: isloading } = useOrderList(
    params.restroId
  );
  const [filteredData, setFilteredData] = useState<OrderData[]>([]);

  const applyFilters = (values: any) => {
    if (!orderList) return;
    let filteredResults: OrderData[] = orderList;

    if (values.order_id || values.order_type || values.order_status) {
      filteredResults = orderList?.filter((item: any) => {
        // Filter by order id
        if (values.order_id && item.order_id !== values.order_id) {
          return false;
        }

        //filter by order type
        if (
          values.order_type &&
          item.order_type.toLowerCase() !== values.order_type.toLowerCase()
        ) {
          return false;
        }

        //filter by order status
        if (
          values.order_status &&
          item.order_status.toLowerCase() !== values.order_status.toLowerCase()
        ) {
          return false;
        }

        return true;
      });
    }

    setFilteredData(filteredResults);
    // setCurrentPage(1);
    console.log(filteredResults);
  };

  useEffect(() => {
    dispatch(clearStationData());
  }, [dispatch]);

  useEffect(() => {
    if (orderList) {
      setFilteredData(orderList);
    }
  }, [orderList]);

  return (
    <div
      className={` bg-white dark:bg-secondary_dark rounded-sm sm:p-6 p-4 flex flex-col gap-6 shadow-sm shadow-vll_gray dark:shadow-none ${open_sans.className}`}
    >
      <Breadcrumb className="mb-4">
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
              {restroName} Orders
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className=" flex flex-col gap-4">
        <div>
          <OrderForm onSubmit={applyFilters} />
        </div>
        {isloading ? (
          <p>Loading Order List...</p>
        ) : orderList && orderList.length > 0 ? (
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
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Order Status</TableHead>
                  </TableRow>
                </TableHeader>
                {filteredData && filteredData.length > 0 ? (
                  <TableBody>
                    {filteredData.map((order: OrderData) => {
                      return (
                        <TableRow key={order.id} className="">
                          <TableCell>{order.order_id}</TableCell>
                          <TableCell>{order.ordered_date}</TableCell>
                          <TableCell>{order.full_name}</TableCell>
                          <TableCell>{order.address}</TableCell>
                          <TableCell>{order.order_status}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                ) : (
                  <div className="text-base font-normal text-center pt-12">
                    No matching items found!
                  </div>
                )}
              </Table>
            </ScrollArea>
          </div>
        ) : orderList?.length <= 0 ? (
          <p>No orders found!</p>
        ) : (
          <p>Couldn&apos;t load order list!</p>
        )}
      </div>
    </div>
  );
};

export default Page;
