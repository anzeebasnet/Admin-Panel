"use client";

import { Open_Sans } from "next/font/google";
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
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Button } from "@/components/ui/button";
import axios, { axiosPrivate } from "@/axios/axios";
import { UserListType } from "@/types/types";
import Link from "next/link";
import SearchForm from "@/components/Forms/SearchForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppSelector } from "@/lib/store/hooks";
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
  const [userList, setUserList] = useState<UserListType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [filteredData, setFilteredData] = useState<UserListType[]>([]);
  const [resetTrigger, setResetTrigger] = useState<boolean>(false);

  const sidebar = useAppSelector(
    (state: RootState) => state.collapsible.collapse
  );

  const fetchUsers = async (page: number) => {
    setLoading(true);
    try {
      const res = await axios.get(`/admin/user/list/?page=${page}`);
      setUserList(res.data.data);
      setFilteredData(res.data.data);
      setTotalPages(res.data.meta.total_pages);
    } catch (error) {
      console.error("Error fetching users.", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  // Handle pagination logic
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      setResetTrigger(true);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      setResetTrigger(true);
    }
  };

  const applyFilters = (values: any) => {
    if (!userList) return;
    let filteredResults: UserListType[] = userList;

    if (
      values.dateJoined ||
      values.is_otp_verified ||
      values.user_type ||
      values.is_deleted
    ) {
      filteredResults = userList?.filter((item: any) => {
        // Filter by dateJoined
        if (values.dateJoined && item.date_joined !== values.dateJoined) {
          return false;
        }

        //filter by otp verification status
        if (
          values.is_otp_verified &&
          item.is_otp_verified !== (values.is_otp_verified === "yes") // Convert 'yes'/'no' to true/false
        ) {
          return false;
        }

        //filter by user type
        if (
          values.user_type &&
          item.user_type.toLowerCase() !== values.user_type.toLowerCase()
        ) {
          return false;
        }

        // filter by delete status
        if (
          values.is_deleted &&
          item.is_deleted !== (values.is_deleted === "yes") // Convert 'yes'/'no' to true/false
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

  return (
    <div
      className={` bg-white dark:bg-secondary_dark rounded-sm p-6 flex flex-col gap-6 shadow-sm shadow-vll_gray dark:shadow-none ${open_sans.className}`}
    >
      <div className="flex sm:flex-row flex-col justify-between">
        <Breadcrumb className="mb-4 -ml-1">
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
                Users
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Button className="bg-primary_text dark:bg-btn_blue text-white hover:bg-l_orange dark:hover:bg-blue w-24 place-self-end">
          Add Users
        </Button>
      </div>
      <div className="flex md:flex-row flex-col gap-6">
        <div className="md:h-[50vh]">
          <SearchForm onSubmit={applyFilters} resetTrigger={resetTrigger} />
        </div>
        {loading ? (
          <div className="w-full sm:h-96 h-36 p-4 text-center font-normal text-base bg-white dark:bg-primary_dark rounded-sm shadow-md shadow-vll_gray dark:shadow-none">
            Loading...
          </div>
        ) : userList?.length > 0 ? (
          <div>
            <ScrollArea
              className={`${
                sidebar
                  ? "xl:w-[60vw] lg:w-[50vw] w-[60vw] h-[70vh]"
                  : "w-[75vw] h-[70vh]"
              }`}
            >
              <Table className=" ">
                <TableCaption></TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>User Type</TableHead>
                    <TableHead>Date Joined</TableHead>
                    {/* <TableHead>OTP Verified</TableHead>
                    <TableHead>Deleted</TableHead>
                    <TableHead className="text-right">Status</TableHead> */}
                  </TableRow>
                </TableHeader>
                {filteredData && filteredData.length > 0 ? (
                  <TableBody>
                    {filteredData.map((user) => {
                      return (
                        <TableRow key={user.id} className="w-[70%]">
                          <TableCell className="font-medium">
                            <Link
                              href={`/users/${user.id}`}
                              prefetch={true}
                              className="hover:text-primary_text dark:hover:text-sidebar_blue"
                            >
                              {user.first_name} {user.last_name}
                            </Link>
                          </TableCell>
                          <TableCell>
                            <Link
                              href={`/users/${user.id}`}
                              prefetch={true}
                              className="hover:text-primary_text dark:hover:text-sidebar_blue"
                            >
                              {user.username}
                            </Link>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.phone_number}</TableCell>
                          <TableCell>{user.user_type}</TableCell>
                          <TableCell>{user.date_joined}</TableCell>
                          {/* <TableCell>
                            {user.is_otp_verified ? "Yes" : "No"}
                          </TableCell>
                          <TableCell>
                            {user.is_deleted ? "Yes" : "No"}
                          </TableCell>
                          <TableCell className="text-right">
                            {user.status}
                          </TableCell> */}
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
            </ScrollArea>
            <div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={handlePreviousPage}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
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
        )}
      </div>
    </div>
  );
};

export default Page;
