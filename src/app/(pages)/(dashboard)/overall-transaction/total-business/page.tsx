"use client";

import { Open_Sans, Roboto } from "next/font/google";
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700"],
  subsets: ["latin"],
});

const open_sans = Open_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const Page = () => {
  return (
    <div className="flex flex-col gap-6 bg-white dark:bg-secondary_dark rounded-sm shadow-md shadow-vll_gray dark:shadow-none p-6">
      <div className="flex sm:flex-row flex-col justify-between">
        <h1
          className={`text-primary_text dark:text-secondary_text text-lg font-medium ${open_sans.className}`}
        >
          Businesses
        </h1>
      </div>
      <div className="overflow-x-auto">
        <div className="">
          <Table>
            <TableCaption></TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Business</TableHead>
                <TableHead>Business ID</TableHead>
                <TableHead>Business Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Contact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>XYZ</TableCell>
                <TableCell>
                  <Link
                    href={`/overall-transaction/total-business/3Fe23Gt`}
                    className="hover:text-primary_text dark:hover:text-secondary_text"
                    prefetch={true}
                  >
                    3Fe23Gt
                  </Link>
                </TableCell>
                <TableCell>Clothing</TableCell>
                <TableCell>Active</TableCell>
                <TableCell>9823232311</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Page;
