"use client";

import { useSalonVariation } from "@/lib/react-query/queriesAndMutations";
import { useAppDispatch } from "@/lib/store/hooks";
import { SalonServices } from "@/types/types";
import { Open_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import { HiPlusSmall } from "react-icons/hi2";
import { CiEdit } from "react-icons/ci";
import {
  clearSalonService,
  setSalonService,
} from "@/lib/store/features/salonService/salonServiceSlice";
import { AiOutlineDelete } from "react-icons/ai";
import useAxiosPrivateSalon from "@/hooks/useAxiosPrivateSalon";
import toast from "react-hot-toast";

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

  const { data: variations, isLoading: isLoading } = useSalonVariation(
    params.salonId,
    params.serviceId
  );

  const deleteService = async (serviceId: string) => {
    axiosInstance
      .delete(
        `/moreclub/users/saloons/${params.salonId}/services/${serviceId}/`
      )
      .then((response) => {
        console.log("Successfully Deleted Service!", response);
        toast.success("Successfully Deleted Service!", {
          duration: 5000,
          position: "top-right",
        });
      })
      .catch((error) => {
        console.log("Error deleting Service!", error);
        toast.error("Error deleting Service!", {
          duration: 5000,
          position: "top-right",
        });
      });
  };

  useEffect(() => {
    dispatch(clearSalonService());
  }, [dispatch]);

  return (
    <div
      className={` bg-white dark:bg-secondary_dark rounded-sm p-6 flex flex-col gap-6 shadow-sm shadow-vll_gray dark:shadow-none ${open_sans.className}`}
    >
      <div className="flex sm:flex-row flex-col sm:justify-between sm:gap-0 gap-4">
        <h1
          className={`text-primary_text dark:text-sidebar_blue text-lg font-medium ${open_sans.className}`}
        >
          Variations
        </h1>
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
      <div>
        {isLoading ? (
          <p>Loading Variations...</p>
        ) : variations && variations.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {variations.map((variations: SalonServices, index: any) => (
              <div
                key={index}
                className="flex flex-col gap-2 dark:bg-primary_dark rounded-md bg-white shadow-md shadow-vll_gray dark:shadow-none w-40"
              >
                {/* <div className="relative">
                  <Link
                    href={`/salon/${params.salonId}/${params.salonName}/services/${services.id}/${services.name}/items`}
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
                    className="absolute right-0 top-0 bg-white dark:bg-sidebar_blue  p-1 rounded-tr-md "
                    onClick={() => {
                      deleteService(services.id);
                    }}
                  >
                    <AiOutlineDelete
                      size={22}
                      className="text-red-600 dark:text-white"
                    />
                  </button>
                </div> */}
                <div className="flex gap-1 justify-between px-2 pb-4">
                  <Link
                    href={`/salon/${params.salonId}/${params.salonName}/services/${params.serviceId}/${params.serviceName}/items`}
                    className="text-primary_text dark:text-sidebar_blue font-medium place-self-center text-sm capitalize line-clamp-1"
                  >
                    {variations.name}
                  </Link>
                  <Link
                    href={`/salon/${params.salonId}/${params.salonName}/variations/create`}
                    onClick={() => {
                      dispatch(setSalonService(variations));
                    }}
                  >
                    <CiEdit
                      size={23}
                      className="text-primary_text dark:text-sidebar_blue"
                    />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : variations?.length <= 0 ? (
          <p>No services found. Add new services!</p>
        ) : (
          <p>Couldnot load services list</p>
        )}
      </div>
    </div>
  );
};

export default Page;