"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Roboto } from "next/font/google";
import Modal from "@/components/Modal/Modal";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700"],
  subsets: ["latin"],
});

const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className=" p-2 pt-0 flex flex-col gap-6">
      <div className="flex sm:flex-row flex-col justify-between">
        <h1
          className={`text-primary_text dark:text-white text-2xl font-normal ${roboto.className}`}
        >
          Country
        </h1>

        <div>
          <div className="lg:col-span-2 sm:col-span-2 ">
            <Button
              className="bg-primary_text text-white place-self-end"
              onClick={openModal}
            >
              Add Country
            </Button>
          </div>
          <div className="z-40">
            <Modal
              isOpen={isModalOpen}
              onClose={closeModal}
              heading="Add Country"
            />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="sm:w-[75vw] w-[90vw]">
          <Table className=" ">
            <TableCaption></TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Date Created</TableHead>
                <TableHead>Deleted</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Page;
