"use client";

import { useSalonVariation } from "@/lib/react-query/queriesAndMutations";
import { useAppDispatch } from "@/lib/store/hooks";
import { SalonVariation } from "@/types/types";
import { Open_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { HiPlusSmall } from "react-icons/hi2";
import { AiOutlineDelete } from "react-icons/ai";
import useAxiosPrivateSalon from "@/hooks/useAxiosPrivateSalon";
import toast from "react-hot-toast";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CgArrowLeft } from "react-icons/cg";
import {
  clearSalonVariation,
  setSalonVariation,
} from "@/lib/store/features/salonVariation/salonVariationSlice";
import DialogLoader from "@/components/ui/DialogLoader";
import { PencilLine } from "lucide-react";

const open_sans = Open_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const Page = ({
  params,
}: {
  params: {
    salonId: string;
    salonName: string;
    serviceId: string;
    serviceName: string;
  };
}) => {
  const dispatch = useAppDispatch();
  const axiosInstance = useAxiosPrivateSalon();
  const SalonName = decodeURIComponent(params.salonName);
  const serviceName = decodeURIComponent(params.serviceName);
  const [deletingVariation, setDeletingVariation] =
    useState<SalonVariation | null>(null);
  const { data: variations, isLoading: isLoading } = useSalonVariation(
    params.salonId,
    params.serviceId
  );

  const deleteVariation = async (
    variation: SalonVariation,
    variationId: string
  ) => {
    setDeletingVariation(variation);
    axiosInstance
      .delete(
        `/moreclub/users/saloons/${params.salonId}/services/${params.serviceId}/variations/${variationId}/`
      )
      .then((response) => {
        console.log(`Deleted ${variation.name}!`, response);
        toast.success(`Deleted ${variation.name}!`, {
          duration: 5000,
          position: "top-right",
        });
      })
      .catch((error) => {
        console.log(`Error Deleting ${variation.name}!`, error);
        toast.error(`Error Deleting ${variation.name}!`, {
          duration: 5000,
          position: "top-right",
        });
      })
      .finally(() => {
        setDeletingVariation(null);
      });
  };

  useEffect(() => {
    dispatch(clearSalonVariation());
  }, [dispatch]);

  return (
    <div
      className={` bg-white dark:bg-secondary_dark rounded-sm p-6 flex flex-col sm:gap-10 gap-6 shadow-sm shadow-vll_gray dark:shadow-none ${open_sans.className}`}
    >
      <div className="flex sm:flex-row flex-col sm:justify-between sm:gap-0 gap-4">
        <div className="flex flex-col gap-4">
          <Breadcrumb className="-ml-1">
            <BreadcrumbList className="flex sm:gap-1">
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={`/salon/${params.salonId}/${params.salonName}/services`}
                >
                  <CgArrowLeft
                    className="text-primary_text dark:text-sidebar_blue"
                    size={25}
                  />
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbPage className="sm:text-xl text-lg font-medium text-primary_text dark:text-sidebar_blue">
                  {SalonName} Service
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h2 className="sm:text-xl text-lg font-medium text-primary_text dark:text-sidebar_blue">
            {serviceName} Variations
          </h2>
        </div>
        <div className="flex gap-4">
          <Link
            href={`/salon/${params.salonId}/${params.salonName}/services/${params.serviceId}/${params.serviceName}/variation/create`}
            className="bg-primary_text dark:bg-btn_blue text-white text-sm hover:bg-l_orange dark:hover:bg-blue py-1 px-4 rounded place-self-end"
          >
            <div className="flex gap-1 items-center">
              Add New Variation <HiPlusSmall size={23} />
            </div>
          </Link>
        </div>
      </div>
      <div className="">
        {isLoading ? (
          <p>Loading Variations...</p>
        ) : variations && variations.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {variations.map((variations: SalonVariation, index: any) => (
              <div
                key={index}
                className="flex flex-col relative dark:bg-primary_dark rounded-md bg-white shadow-md shadow-vll_gray dark:shadow-none w-44"
              >
                <div className="relative bg-white rounded-t-md">
                  <Image
                    src={variations.images[0].image}
                    alt="variation icon"
                    width={100}
                    height={100}
                    className="w-44 h-32 rounded-t-md"
                  />

                  <button
                    className="absolute right-0 top-0 bg-red-500 hover:bg-white text-white hover:text-red-500 p-1 rounded-tr-md "
                    onClick={() => {
                      deleteVariation(variations, variations.id);
                    }}
                  >
                    <AiOutlineDelete size={22} className="" />
                  </button>
                </div>
                <div className="px-3 py-2 flex flex-col gap-1">
                  <div className="flex gap-1 justify-between">
                    <Link
                      href={`/salon/${params.salonId}/${params.salonName}/services/${params.serviceId}/${params.serviceName}/items`}
                      className="text-primary_text dark:text-sidebar_blue font-medium place-self-center text-base capitalize line-clamp-1"
                    >
                      {variations.name}
                    </Link>

                    <Link
                      href={`/salon/${params.salonId}/${params.salonName}/services/${params.serviceId}/${params.serviceName}/variation/create`}
                      onClick={() => {
                        dispatch(setSalonVariation(variations));
                      }}
                    >
                      <PencilLine
                        size={20}
                        className="text-primary_text dark:text-sidebar_blue"
                      />
                    </Link>
                  </div>
                  <div className="flex gap-1 items-center">
                    <p className="text-sm font-medium">
                      Rs. {variations.discount_price}{" "}
                    </p>
                    <p className="line-through text-xs font-medium">
                      {variations.price}
                    </p>
                  </div>
                  <div className="text-xs font-normal line-clamp-1">
                    {variations.description}
                  </div>
                </div>
                {deletingVariation ? (
                  <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-25 flex justify-center items-center z-50">
                    <div className="bg-white sm:p-8 p-4 rounded shadow-lg lg:w-[30vw] sm:w-[50vw] w-[96vw] flex flex-col gap-2 items-center justify-center">
                      <DialogLoader />
                      <p className="text-black font-normal text-base">
                        Deleting {deletingVariation.name}...
                      </p>
                      <button
                        onClick={() => {
                          setDeletingVariation(null);
                        }}
                        className="bg-red-500 text-white text-sm px-3 py-1 rounded mt-2"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            ))}
          </div>
        ) : variations?.length <= 0 ? (
          <p>No variation found. Add new variation!</p>
        ) : (
          <p>Couldnot load variation list</p>
        )}
      </div>
    </div>
  );
};

export default Page;
