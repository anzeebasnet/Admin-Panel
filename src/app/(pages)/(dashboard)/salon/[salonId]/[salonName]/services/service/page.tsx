"use client";

import { useSalonServices } from "@/lib/react-query/queriesAndMutations";
import { useAppDispatch } from "@/lib/store/hooks";
import { SalonServices } from "@/types/types";
import { Open_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { HiPlusSmall } from "react-icons/hi2";
import { CiEdit } from "react-icons/ci";
import {
  clearSalonService,
  setSalonService,
} from "@/lib/store/features/salonService/salonServiceSlice";
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
import DialogLoader from "@/components/ui/DialogLoader";
import { PencilLine } from "lucide-react";

const open_sans = Open_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const Page = ({
  params,
}: {
  params: { salonId: string; salonName: string };
}) => {
  const dispatch = useAppDispatch();
  const axiosInstance = useAxiosPrivateSalon();
  const SalonName = decodeURIComponent(params.salonName);
  const [deletingService, setDeletingService] = useState<SalonServices | null>(
    null
  );
  const { data: services, isLoading: isLoading } = useSalonServices(
    params.salonId
  );

  const deleteService = async (service: SalonServices, serviceId: string) => {
    setDeletingService(service);
    axiosInstance
      .delete(
        `/moreclub/users/saloons/${params.salonId}/services/${serviceId}/`
      )
      .then((response) => {
        console.log(`Deleted ${service.name}!`, response);
        toast.success(`Deleted ${service.name}!`, {
          duration: 5000,
          position: "top-right",
        });
      })
      .catch((error) => {
        console.log(`Error Deleting ${service.name}!`, error);
        toast.error(`Error Deleting ${service.name}!`, {
          duration: 5000,
          position: "top-right",
        });
      })
      .finally(() => {
        setDeletingService(null);
      });
  };

  return (
    <div
      className={` bg-white dark:bg-secondary_dark rounded-sm p-6 flex flex-col gap-6 shadow-sm shadow-vll_gray dark:shadow-none ${open_sans.className}`}
    >
      <div className="flex sm:flex-row flex-col sm:justify-between sm:gap-0 gap-4">
        <Breadcrumb className="-ml-1">
          <BreadcrumbList className="flex sm:gap-1">
            <BreadcrumbItem>
              <BreadcrumbLink
                href={`/salon/${params.salonId}/${params.salonName}`}
              >
                <CgArrowLeft
                  className="text-primary_text dark:text-sidebar_blue"
                  size={25}
                />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage className="sm:text-xl text-sm font-medium text-primary_text dark:text-sidebar_blue">
                {SalonName} Services
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex gap-4">
          <Link
            href={`/salon/${params.salonId}/${params.salonName}/services/service?create=true`}
            onClick={() => {
              dispatch(clearSalonService());
            }}
            className="bg-primary_text dark:bg-btn_blue text-white text-sm hover:bg-l_orange dark:hover:bg-blue py-1 px-4 rounded place-self-end"
          >
            <div className="flex gap-1 items-center">
              Add New Service <HiPlusSmall size={23} />
            </div>
          </Link>
        </div>
      </div>
      <div className="">
        {isLoading ? (
          <p>Loading Services List...</p>
        ) : services && services.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {services.map((services: SalonServices, index: any) => (
              <div
                key={index}
                className="flex flex-col relative dark:bg-primary_dark rounded-md bg-white shadow-md shadow-vll_gray dark:shadow-none w-40"
              >
                <div className="relative bg-white rounded-t-md">
                  <Link
                    href={`/salon/${params.salonId}/${params.salonName}/services/${services.id}/${services.name}/variation`}
                  >
                    <Image
                      src={services.logo || ""}
                      alt="services icon"
                      width={100}
                      height={100}
                      className="w-40 h-32 rounded-t-md"
                    />
                  </Link>
                  <button
                    className="absolute right-0 top-0 bg-red-500 hover:bg-white text-white hover:text-red-500  p-1 rounded-tr-md "
                    onClick={() => {
                      deleteService(services, services.id);
                    }}
                  >
                    <AiOutlineDelete size={22} className="" />
                  </button>
                </div>
                <div className="flex flex-col gap-1 px-3 py-2">
                  <div className="flex gap-1 justify-between">
                    <Link
                      href={`/salon/${params.salonId}/${params.salonName}/services/${services.id}/${services.name}/variation`}
                      className="text-primary_text dark:text-sidebar_blue hover:text-deep_red font-medium place-self-center text-base capitalize line-clamp-1"
                    >
                      {services.name}
                    </Link>
                    <Link
                      href={`/salon/${params.salonId}/${params.salonName}/services/service?create=true`}
                      onClick={() => {
                        dispatch(setSalonService(services));
                      }}
                    >
                      <PencilLine
                        size={20}
                        className="text-primary_text dark:text-sidebar_blue hover:text-deep_red"
                      />
                    </Link>
                  </div>
                  <Link
                    href={`/salon/${params.salonId}/${params.salonName}/services/${services.id}/${services.name}/variation`}
                    className="text-sm font-medium hover:underline"
                  >
                    {services.variations.length} items
                  </Link>
                </div>

                {deletingService ? (
                  <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-25 flex justify-center items-center z-50">
                    <div className="bg-white sm:p-8 p-4 rounded shadow-lg lg:w-[30vw] sm:w-[50vw] w-[96vw] flex flex-col gap-2 items-center justify-center">
                      <DialogLoader />
                      <p className="text-black font-normal text-base">
                        Deleting {deletingService.name}...
                      </p>
                      <button
                        onClick={() => {
                          setDeletingService(null);
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
        ) : services?.length <= 0 ? (
          <p>No services found. Add new services!</p>
        ) : (
          <p>Couldnot load services list</p>
        )}
      </div>
    </div>
  );
};

export default Page;
