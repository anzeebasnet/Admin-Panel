"use client";

import {
  useMenuList,
  useRestroMenuList,
} from "@/lib/react-query/queriesAndMutations";
import {
  clearMenuItem,
  setMenuItem,
} from "@/lib/store/features/menu/menuSlice";
import { useAppDispatch } from "@/lib/store/hooks";
import { MenuItem, RestroMenuList } from "@/types/types";
import { Open_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import { HiPlusSmall } from "react-icons/hi2";
import { CiEdit } from "react-icons/ci";
import { AiOutlineDelete } from "react-icons/ai";
import axios from "axios";
import toast from "react-hot-toast";

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

  const { data: restroMenuList, isLoading: isLoading } = useRestroMenuList(
    params.restroId
  );

  return (
    <div
      className={` bg-white dark:bg-secondary_dark rounded-sm p-6 flex flex-col gap-6 shadow-sm shadow-vll_gray dark:shadow-none ${open_sans.className}`}
    >
      <div className="flex sm:flex-row flex-col sm:justify-between sm:gap-0 gap-4">
        <h1
          className={`text-primary_text dark:text-sidebar_blue text-lg font-semibold ${open_sans.className}`}
        >
          {RestroName} Gallery
        </h1>
      </div>

      <div className="flex sm:gap-8 gap-4">
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
            src={"/images/restroGallery.jpg"}
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
