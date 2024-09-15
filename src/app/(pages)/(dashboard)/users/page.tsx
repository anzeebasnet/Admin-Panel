"use client";

import { Roboto } from "next/font/google";
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

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700"],
  subsets: ["latin"],
});

const Page = () => {
  const [userList, setUserList] = useState<UserListType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const userid = "12121dwew";

  const fetchUsers = async (page: number) => {
    setLoading(true);
    try {
      const res = await axiosPrivate.get(`/admin/user/list/?page=${page}`);
      setUserList(res.data.data);
      setTotalPages(res.data.meta.total_pages); // Set the total number of pages
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
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <div className="sm:p-4 p-2 flex flex-col gap-6 min-h-screen">
      <div className="flex sm:flex-row flex-col justify-between">
        <h1
          className={`text-bg_orange dark:text-white text-2xl font-normal ${roboto.className}`}
        >
          <Link href={`/users/${userid}`}>Users</Link>
        </h1>
        <Button className="bg-bg_orange w-24 place-self-end">Add Users</Button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <div className="overflow-x-auto">
            <div className="lg:w-[70vw] w-[90vw]">
              <Table className="">
                <TableCaption></TableCaption>

                <TableHeader>
                  <TableRow>
                    <TableHead className="">Full Name</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userList.map((user) => {
                    return (
                      <TableRow key={user.id} className="w-[70%]">
                        <TableCell className="font-medium">
                          {user.first_name} {user.last_name}
                        </TableCell>
                        <TableCell><Link href={`/users/${user.id}`}>{user.username}</Link></TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phone_number}</TableCell>

                        <TableCell className="text-right">
                          {user.status}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
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
      )}
    </div>
  );
};

export default Page;
