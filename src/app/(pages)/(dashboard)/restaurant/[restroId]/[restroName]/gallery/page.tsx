"use client";

import { useAppDispatch } from "@/lib/store/hooks";
import { Open_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import React from "react";
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
  const RestroName = decodeURIComponent(params.restroName);

  return (
    <div
      className={` bg-white dark:bg-secondary_dark rounded-sm p-6 flex flex-col gap-6 shadow-sm shadow-vll_gray dark:shadow-none ${open_sans.className}`}
    >
      <Breadcrumb className="mb-4">
        <BreadcrumbList className="flex sm:gap-1">
          <BreadcrumbItem>
            <BreadcrumbLink
              href={`/restaurant/${params.restroId}/${params.restroName}`}
            >
              <CgArrowLeft
                className="text-primary_text dark:text-sidebar_blue"
                size={25}
              />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbPage className="sm:text-xl text-lg font-medium text-primary_text dark:text-sidebar_blue">
              {RestroName} Gallery
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex sm:gap-8 gap-4 pl-1">
        <Link
          href={`/restaurant/${params.restroId}/${params.restroName}/gallery/restroGallery`}
          className="relative "
        >
          <Image
            src={"/images/userGallery.jpg"}
            alt="user gallery"
            height={300}
            width={300}
            className="rounded-sm"
          />
          <div className="bg-vl_gray absolute bottom-0 w-full h-12 flex justify-center items-center rounded-b-sm">
            <p className="text-sm font-medium text-white text-center">
              Restaurant Gallery
            </p>
          </div>
        </Link>
        <Link
          href={`/restaurant/${params.restroId}/${params.restroName}/gallery/userGallery`}
          className="relative"
        >
          <Image
            src={"/images/restrogallery.jpg"}
            alt="restaurant gallery"
            width={300}
            height={300}
            className="rounded-sm"
          />
          <div className="bg-vl_gray absolute bottom-0 w-full h-12 flex justify-center items-center rounded-b-sm">
            <p className="text-sm font-medium text-white text-center">
              User Gallery
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Page;
