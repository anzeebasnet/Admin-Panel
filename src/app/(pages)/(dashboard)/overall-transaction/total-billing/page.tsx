"use client";

import { Open_Sans, Roboto } from "next/font/google";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Button } from "@/components/ui/button";
import { axiosPrivate } from "@/axios/axios";
import { UserListType } from "@/types/types";
import Link from "next/link";
import SearchForm from "@/components/Forms/SearchForm";
import { CalendarPlus } from "lucide-react";
import { useUsersList } from "@/lib/react-query/queriesAndMutations";
import BillSearchForm from "@/components/Forms/BillSearchForm";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700"],
  subsets: ["latin"],
});

const open_sans = Open_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const Page = () => {
  const [userList, setUserList] = useState<UserListType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [filteredData, setFilteredData] = useState<UserListType[]>([]);
  const [resetTrigger, setResetTrigger] = useState<boolean>(false);
  // const usersPerPage = 20;

  // const { data: users, isLoading: isLoadingUsersList } = useUsersList(
  //   currentPage,
  //   setTotalPages,
  //   setFilteredData,
  //   setUserList
  // );

  // // Handle pagination logic
  // const handlePreviousPage = () => {
  //   if (currentPage > 1) {
  //     setCurrentPage((prev) => prev - 1);
  //     setResetTrigger(true);
  //   }
  // };

  // const handleNextPage = () => {
  //   if (currentPage < totalPages) {
  //     setCurrentPage((prev) => prev + 1);
  //     setResetTrigger(true);
  //   }
  // };

  const applyFilters = (values: any) => {
    // if (!userList) return;
    // let filteredResults: UserListType[] = userList;
    // if (
    //   values.dateJoined ||
    //   values.is_otp_verified ||
    //   values.user_type ||
    //   values.is_deleted
    // ) {
    //   filteredResults = userList?.filter((item: any) => {
    //     // Filter by dateJoined
    //     if (values.dateJoined && item.date_joined !== values.dateJoined) {
    //       return false;
    //     }
    //     //filter by otp verification status
    //     if (
    //       values.is_otp_verified &&
    //       item.is_otp_verified !== (values.is_otp_verified === "yes") // Convert 'yes'/'no' to true/false
    //     ) {
    //       return false;
    //     }
    //     //filter by user type
    //     if (
    //       values.user_type &&
    //       item.user_type.toLowerCase() !== values.user_type.toLowerCase()
    //     ) {
    //       return false;
    //     }
    //     // filter by delete status
    //     if (
    //       values.is_deleted &&
    //       item.is_deleted !== (values.is_deleted === "yes") // Convert 'yes'/'no' to true/false
    //     ) {
    //       return false;
    //     }
    //     return true;
    //   });
    // }
    // setFilteredData(filteredResults);
    // // setCurrentPage(1);
    // console.log(filteredResults);
  };

  // // Pagination for filtered data
  // const paginatedFilteredData = filteredData.slice(
  //   (currentPage - 1) * usersPerPage,
  //   currentPage * usersPerPage
  // );

  return (
    <div className=" flex flex-col gap-6 bg-white dark:bg-secondary_dark rounded-sm shadow-md shadow-vll_gray dark:shadow-none p-6">
      <div className="flex flex-col">
        <div className="flex sm:flex-row flex-col justify-between">
          <h1
            className={`text-primary_text dark:text-sidebar_blue text-lg font-medium ${open_sans.className}`}
          >
            Total Billing
          </h1>
        </div>
        <BillSearchForm onSubmit={applyFilters} resetTrigger={resetTrigger} />
      </div>
      {/* {loading ? (
        <div className="text-center font-normal text-lg">Loading...</div>
      ) : userList?.length > 0 ? (
        <div>
          <div className="overflow-x-auto">
            <div className="lg:w-[80vw] w-[90vw]">
              <Table className="">
                <TableCaption></TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="">Full Name</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>User Type</TableHead>
                    <TableHead>Date Joined</TableHead>
                    <TableHead>OTP Verified</TableHead>
                    <TableHead>Deleted</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                {filteredData && filteredData.length > 0 ? (
                  <TableBody>
                    {filteredData.map((user) => {
                      return (
                        <TableRow key={user.id} className="w-[70%]">
                          <TableCell className="font-medium">
                            {user.first_name} {user.last_name}
                          </TableCell>
                          <TableCell>
                            <Link href={`/users/${user.id}`} prefetch={true}>
                              {user.username}
                            </Link>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.phone_number}</TableCell>
                          <TableCell>{user.user_type}</TableCell>
                          <TableCell>{user.date_joined}</TableCell>
                          <TableCell>
                            {user.is_otp_verified ? "Yes" : "No"}
                          </TableCell>
                          <TableCell>
                            {user.is_deleted ? "Yes" : "No"}
                          </TableCell>
                          <TableCell className="text-right">
                            {user.status}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                ) : (
                  <div className="text-base font-normal text-center pt-12">
                    No matching items!
                  </div>
                )}
              </Table>
            </div>
          </div>
          <div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={handlePreviousPage}
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">{currentPage}</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={handleNextPage}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      ) : (
        "Couldn't load users list!"
      )} */}
    </div>
  );
};

export default Page;
