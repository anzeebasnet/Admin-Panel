"use client";

import { useOfferList } from "@/lib/react-query/queriesAndMutations";
import { useAppDispatch } from "@/lib/store/hooks";
import { Offer } from "@/types/types";
import { Open_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { HiPlusSmall } from "react-icons/hi2";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CgArrowLeft } from "react-icons/cg";
import { PencilLine } from "lucide-react";
import { CiEdit } from "react-icons/ci";
import { AiOutlineDelete } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { setOfferData } from "@/lib/store/features/restroOffer/restroOfferSlice";
import DialogLoader from "@/components/ui/DialogLoader";
import useAxiosPrivateFood from "@/hooks/useAxiosPrivateFood";
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
  const { data: offers, isLoading: isLoading } = useOfferList(params.restroId);
  const [deletingOffer, setDeletingOffer] = useState<Offer | null>(null);
  const restroName = decodeURIComponent(params.restroName);
  const dispatch = useAppDispatch();
  const axiosInstance = useAxiosPrivateFood();

  const deleteOffer = async (offer: Offer) => {
    setDeletingOffer(offer);
    axiosInstance
      .delete(`/moreclub/user/offers/${params.restroId}/${offer.id}/delete/`)
      .then((response) => {
        console.log("Deleted Offer!", response);
        toast.success("Deleted Offer", {
          duration: 5000,
          position: "top-right",
        });
      })
      .catch((error) => {
        console.log("Error Deleting Offer!", error);
        toast.error("Error Deleting Offer", {
          duration: 5000,
          position: "top-right",
        });
      })
      .finally(() => {
        setDeletingOffer(null);
      });
  };

  return (
    <div
      className={` bg-white dark:bg-secondary_dark rounded-sm p-6 flex flex-col gap-6 shadow-sm shadow-vll_gray dark:shadow-none ${open_sans.className}`}
    >
      <div className="flex sm:flex-row flex-col sm:justify-between sm:gap-0 gap-4">
        <Breadcrumb className="mb-4">
          <BreadcrumbList className="flex sm:gap-1">
            <BreadcrumbItem>
              <BreadcrumbLink
                href={`/restaurant/${params.restroId}/${params.restroName}/`}
              >
                <CgArrowLeft
                  className="text-primary_text dark:text-sidebar_blue"
                  size={25}
                />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage className="sm:text-xl text-lg font-medium text-primary_text dark:text-sidebar_blue">
                {restroName} Offer
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex gap-4">
          <Link
            href={`/restaurant/${params.restroId}/${params.restroName}/offer/create`}
            className="bg-primary_text dark:bg-btn_blue text-white text-sm hover:bg-l_orange dark:hover:bg-blue 
            py-1 px-4 rounded place-self-end"
          >
            <div className="flex gap-1 items-center">
              Add New Offer <HiPlusSmall size={23} />
            </div>
          </Link>
        </div>
      </div>
      <div className="pl-1">
        {isLoading ? (
          <p>Loading offers...</p>
        ) : offers && offers.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {offers.map((offer: Offer, index: number) => (
              <div
                key={index}
                className="flex flex-col relative rounded-md bg-beige dark:bg-card_blue shadow-md shadow-vll_gray dark:shadow-none"
                style={{ width: "320px" }}
              >
                <div className="relative">
                  <Image
                    src={offer.banner || ""}
                    alt="offer banner"
                    width={100}
                    height={100}
                    className="w-full h-64 rounded-t-md"
                  />
                  <h2
                    className="absolute top-0 right-0 bg-beige dark:bg-card_blue text-deep_red dark:text-white w-full 
                       p-4 rounded-t-md bg-opacity-5 text-center font-semibold text-sm capitalize"
                  >
                    {offer.name}
                  </h2>
                </div>
                <div className="flex flex-col gap-2 justify-between p-4 bg-beige dark:bg-card_blue rounded-b-md flex-grow">
                  <div className="flex flex-col gap-1">
                    <p className="text-[15px] font-semibold text-deep_red dark:text-sidebar_blue">
                      Offer Starts
                    </p>
                    {offer.start_offer && offer.end_offer ? (
                      <div>
                        <p className="text-[15px] font-medium">
                          {new Date(offer.start_offer).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "long",
                              day: "2-digit",
                              month: "short",
                              year: "2-digit",
                            }
                          )}
                        </p>
                        <p className="text-[15px] font-medium">
                          Up-to{" "}
                          {new Date(offer.end_offer).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "long",
                              day: "2-digit",
                              month: "short",
                              year: "2-digit",
                            }
                          )}
                        </p>
                      </div>
                    ) : null}
                    {/* Applicable Days */}
                    {offer.applicable_days && (
                      <div>
                        {Object.entries(offer.applicable_days).map(
                          ([day, timeRange], idx) =>
                            timeRange ? (
                              <p key={idx} className="text-[15px] font-medium">
                                {day},{" "}
                                {new Date(
                                  timeRange.start_time
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "2-digit",
                                })}
                                :{" "}
                                {new Date(
                                  timeRange.start_time
                                ).toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                })}{" "}
                                -{" "}
                                {new Date(
                                  timeRange.end_time
                                ).toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                })}
                              </p>
                            ) : null
                        )}
                      </div>
                    )}
                    <div className="flex gap-2 mt-2">
                      {offer.food_item?.map((item, index) => (
                        <div key={index}>
                          <p className="bg-deep_red dark:bg-sidebar_blue text-white rounded text-[13px] p-1">
                            {item.name}
                          </p>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm font-medium mt-1">
                      Rs. {offer.price} only
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/restaurant/${params.restroId}/${params.restroName}/offer/create`}
                      className="bg-btn_blue py-1 px-3 text-sm font-medium text-white rounded flex gap-1"
                      onClick={() => {
                        dispatch(setOfferData(offer));
                      }}
                    >
                      <CiEdit size={20} />
                      <p>Edit</p>
                    </Link>
                    <button
                      onClick={() => {
                        deleteOffer(offer);
                      }}
                      className="bg-red-600 py-1 px-3 text-sm font-medium text-white rounded flex gap-1"
                    >
                      <MdDelete size={20} />
                      <p>Delete</p>
                    </button>
                  </div>
                </div>
                {deletingOffer ? (
                  <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-25 flex justify-center items-center z-50">
                    <div className="bg-white sm:p-8 p-4 rounded shadow-lg lg:w-[30vw] sm:w-[50vw] w-[96vw] flex flex-col gap-2 items-center justify-center">
                      <DialogLoader />
                      <p className="text-black font-normal text-base">
                        Deleting {deletingOffer.name}...
                      </p>
                      <button
                        onClick={() => {
                          setDeletingOffer(null);
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
        ) : offers?.length <= 0 ? (
          <p>No offer found. Add new offer!</p>
        ) : (
          <p>Couldn&apos;t load offer list!</p>
        )}
      </div>
    </div>
  );
};

export default Page;
