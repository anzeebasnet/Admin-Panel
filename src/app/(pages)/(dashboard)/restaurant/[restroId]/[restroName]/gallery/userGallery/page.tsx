"use client";

import {
  useAcceptedGallery,
  usePendingGallery,
  useRestroMenuList,
} from "@/lib/react-query/queriesAndMutations";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { Open_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AcceptedGallery } from "@/types/types";
import { RootState } from "@/lib/store/store";
import axios from "axios";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import Loader from "@/components/ui/Loader";
import useAxiosPrivateFood from "@/hooks/useAxiosPrivateFood";

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
  const [isVerifying, setisVerifying] = useState(false);
  const [isDeleting, setisDeleting] = useState(false);
  const axiosInstance = useAxiosPrivateFood();
  const sidebar = useAppSelector(
    (state: RootState) => state.collapsible.collapse
  );

  const { data: pendingGallery, isLoading: isLoading } = usePendingGallery(
    params.restroId
  );

  const { data: acceptedGallery, isLoading: isLoadingAccepted } =
    useAcceptedGallery(params.restroId);

  const VerifyImage = async (imageId: string) => {
    const payload = {
      status: "verified",
    };
    setisVerifying(true);
    axiosInstance
      .post(
        `/moreclub/user/restaurants/gallery/user/upload/${params.restroId}/${imageId}/`,
        payload
      )
      .then((response) => {
        console.log("Image Verified", response);
        toast.success("Verified Image", {
          duration: 5000,
          position: "top-right",
        });
      })
      .catch((error) => {
        console.log("Error verifying image", error);
        toast.error("Error verifying image", {
          duration: 5000,
          position: "top-right",
        });
      })
      .finally(() => {
        setisVerifying(false);
      });
  };

  const DeleteImage = async (imageId: string) => {
    const payload = {
      status: "delete",
    };
    setisDeleting(true);
    axiosInstance
      .post(
        `/moreclub/user/restaurants/gallery/user/upload/${params.restroId}/${imageId}/`,
        payload
      )
      .then((response) => {
        console.log("Image Deleted", response);
        toast.success("Deleted Image", {
          duration: 5000,
          position: "top-right",
        });
      })
      .catch((error) => {
        console.log("Error deleting image", error);
        toast.error("Error deleting image", {
          duration: 5000,
          position: "top-right",
        });
      })
      .finally(() => {
        setisDeleting(false);
      });
  };

  return (
    <div
      className={` bg-white dark:bg-secondary_dark rounded-sm p-6 flex flex-col gap-6 shadow-sm shadow-vll_gray dark:shadow-none ${open_sans.className}`}
    >
      <h1
        className={`text-primary_text dark:text-sidebar_blue text-lg font-semibold ${open_sans.className}`}
      >
        User Gallery
      </h1>

      <div>
        <Tabs defaultValue="accepted" className=" flex flex-col gap-6">
          <TabsList className="bg-white dark:bg-secondary_dark gap-2 place-self-start">
            <TabsTrigger
              value="accepted"
              className="bg-green-600 text-white data-[state=active]:bg-green-600 data-[state=active]:border-2 data-[state=active]:border-green-950  data-[state=active]:text-white "
            >
              Accepted
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="bg-greenish_blue text-white data-[state=active]:bg-greenish_blue data-[state=active]:text-white data-[state=active]:border-2 data-[state=active]:border-deep_blue "
            >
              Pending
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="accepted"
            className={`${
              sidebar
                ? " xl:w-[75vw] lg:w-[70vw] sm:w-[90vw] w-[80vw]"
                : " w-[88vw]"
            }`}
          >
            {isLoadingAccepted ? (
              <p>Loading Accepted Gallery...</p>
            ) : acceptedGallery && acceptedGallery.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {acceptedGallery.map((item: AcceptedGallery) => (
                  <div key={item.id}>
                    <div className="relative">
                      <Image
                        src={item.image}
                        alt="accepted image"
                        width={200}
                        height={200}
                        className="w-40 h-40 rounded-sm"
                      />
                      <div className="bg-vl_gray absolute bottom-0 w-full h-10 flex justify-center items-center rounded-b-sm">
                        <Button
                          onClick={() => {
                            DeleteImage(item.id);
                          }}
                          className={` bg-red-600 text-[13px] font-medium text-white text-center`}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>Couldn&apos;t load accepted gallery!</p>
            )}
          </TabsContent>

          <TabsContent
            value="pending"
            className={`${
              sidebar
                ? " xl:w-[75vw] lg:w-[70vw] sm:w-[90vw] w-[80vw]"
                : " w-[88vw]"
            }`}
          >
            {isLoading ? (
              <p>Loading Pending Gallery...</p>
            ) : pendingGallery && pendingGallery.length > 0 ? (
              <div className="flex flex-wrap items-end gap-2">
                {pendingGallery.map((item: AcceptedGallery) => (
                  <div key={item.id}>
                    <div className="relative">
                      <Image
                        src={item.image}
                        alt="accepted image"
                        height={200}
                        width={200}
                        className="rounded-sm"
                      />
                      <div className="bg-vl_gray absolute bottom-0 w-full h-10 flex justify-center gap-4 items-center rounded-b-sm">
                        <Button
                          onClick={() => {
                            VerifyImage(item.id);
                          }}
                          className={`bg-green-500 text-[13px] font-medium text-white text-center py-1`}
                        >
                          Verify
                        </Button>
                        <Button
                          onClick={() => {
                            DeleteImage(item.id);
                          }}
                          className={`bg-red-600 text-[13px] font-medium text-white text-center`}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>Couldn&apos;t load pending gallery!</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Page;
