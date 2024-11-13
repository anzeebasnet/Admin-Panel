"use client";

import { UserBasicInfoType, UserProfileType } from "@/types/types";
import { Inria_Sans, Open_Sans } from "next/font/google";
import { Roboto_Condensed } from "next/font/google";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaUser } from "react-icons/fa";

const inria_sans = Inria_Sans({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
});
const roboto_condensed = Roboto_Condensed({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
});
const open_sans = Open_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const Page = ({ params }: { params: { businessId: string[] } }) => {
  const [userProfile, setUserProfile] = useState<UserProfileType>();
  const [userBasicInfo, setUserBasicInfo] = useState<UserBasicInfoType>();
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(true);
  const [isLoadingBasicInfo, setIsLoadingBasicInfo] = useState<boolean>(true);

  return (
    <div className="flex flex-col gap-4">
      <h1
        className={`text-primary_text dark:text-secondary_text text-lg font-medium ${open_sans.className}`}
      >
        Business Detail
      </h1>

      <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
        <Tabs defaultValue="profile" className="">
          <div className="mb-4">
            <TabsList className="inline-flex gap-1 justify-center items-center bg-muted mb-2">
              <TabsTrigger value="profile" className="bg-white">
                Profile
              </TabsTrigger>
              <TabsTrigger value="createEvent" className="bg-white">
                Create Event
              </TabsTrigger>
              <TabsTrigger value="bookEvent" className="bg-white">
                Book Event
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="profile">
            <div className="flex flex-col gap-4">
              <div className="bg-white dark:bg-secondary_dark rounded-sm shadow-md shadow-vll_gray dark:shadow-none sm:p-8 p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 border-b border-b-vl_gray ">
                  <h2
                    className={`text-primary_text dark:text-secondary_text sm:text-xl text-lg  font-medium ${inria_sans.className}  sm:pb-2`}
                  >
                    Business Profile
                  </h2>
                  <FaUser size={20} className="pb-1 font-semibold" />
                </div>
                <div>
                  <p
                    className={`sm:text-lg text-sm  ${roboto_condensed.className} capitalize`}
                  >
                    {userBasicInfo?.first_name} {userBasicInfo?.last_name}
                  </p>
                  <p
                    className={`sm:text-lg text-sm  ${roboto_condensed.className}`}
                  >
                    {userBasicInfo?.email}
                  </p>
                  <p
                    className={`sm:text-lg text-sm  ${roboto_condensed.className} capitalize`}
                  >
                    {params.businessId}
                  </p>
                </div>
              </div>
              <div className="bg-white dark:bg-secondary_dark rounded-sm shadow-md shadow-vll_gray dark:shadow-none sm:p-8 p-4 flex flex-col gap-4">
                <h2
                  className={`text-primary_text dark:text-secondary_text sm:text-xl text-lg font-medium ${inria_sans.className} border-b border-b-vl_gray sm:pb-2`}
                >
                  Basic Detail
                </h2>
                <div
                  className={`flex flex-col gap-1 sm:text-base text-sm ${roboto_condensed.className}`}
                >
                  <p className={` capitalize`}>
                    Full Name: {userBasicInfo?.first_name}{" "}
                    {userBasicInfo?.last_name}
                  </p>
                  <p>Username: {userBasicInfo?.username || "null"}</p>
                  <p>Email Address: {userBasicInfo?.email || "null"}</p>
                  <p>Status: {userBasicInfo?.status || "null"}</p>
                  <p>Contact: {userBasicInfo?.phone_number || "null"}</p>
                  <p>Gender: {userProfile?.gender || "null"}</p>
                  <p>Date of Birth: {userProfile?.date_of_birth || "null"}</p>
                  <p>Country: {userProfile?.country || "null"}</p>
                  <p>Address: {userProfile?.address || "null"}</p>
                  <p>City: {userProfile?.city || "null"}</p>
                  <p>Street: {userProfile?.street || "null"}</p>
                  <p>Zip Code: {userProfile?.zip_code || "null"}</p>
                  <p>House No.: {userProfile?.house_no || "null"}</p>
                  <p>
                    Secondary Phone Number:{" "}
                    {userProfile?.secondary_phone_number || "null"}
                  </p>
                  <p>
                    Secondary Email: {userProfile?.secondary_email || "null"}
                  </p>
                  <p>Date Created: {userBasicInfo?.created || "null"}</p>
                  <p>Date Modified: {userBasicInfo?.modified || "null"}</p>
                  <p>Date Joined: {userBasicInfo?.date_joined || "null"}</p>
                  <p>Last Login: {userBasicInfo?.last_login || "null"}</p>
                </div>
              </div>
            </div>{" "}
          </TabsContent>
          <TabsContent value="createEvent">
            <div className="flex flex-col sm:gap-8 gap-4">
              <div className="dark:bg-card_dark bg-white  sm:p-8 p-4 rounded-md flex flex-col gap-4">
                <h2
                  className={`text-primary_text dark:text-secondary_text sm:text-xl text-lg font-medium ${inria_sans.className} border-b border-b-vl_gray sm:pb-2`}
                >
                  Create Event
                </h2>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="bookEvent">
            <div className="flex flex-col sm:gap-8 gap-4">
              <div className="dark:bg-card_dark bg-white  sm:p-8 p-4 rounded-md flex flex-col gap-4">
                <h2
                  className={`text-primary_text dark:text-secondary_text sm:text-xl text-lg font-medium ${inria_sans.className} border-b border-b-vl_gray sm:pb-2`}
                >
                  Book Event
                </h2>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="bg-white dark:bg-secondary_dark rounded-sm shadow-md shadow-vll_gray dark:shadow-none sm:py-8 sm:pr-4 sm:pl-8 pl-4 py-4 pr-2 flex flex-col gap-4 sm:mt-16">
          <h2
            className={`text-primary_text dark:text-secondary_text sm:text-xl text-lg font-medium ${inria_sans.className} border-b border-b-vl_gray sm:pb-2`}
          >
            Transaction Detail
          </h2>
          <div className="overflow-y-auto">
            <div className="sm:h-[100vh] h-[50vh] flex flex-col gap-4 pr-4">
              <div className="dark:bg-purple bg-primary_light rounded-md p-4">
                <div
                  className={`flex justify-between sm:text-base text-sm ${roboto_condensed.className}`}
                >
                  <p>Date</p>
                  <p>Amount</p>
                </div>
                <div className="flex justify-between font-normal sm:text-base text-sm">
                  <div className="flex gap-4">
                    <p>2024-9-16</p>
                    <p>Description</p>
                  </div>
                  <p>$1000</p>
                </div>
              </div>
              <div className="dark:bg-purple bg-primary_light rounded-md p-4">
                <div
                  className={`flex justify-between sm:text-base text-sm ${roboto_condensed.className}`}
                >
                  <p>Date</p>
                  <p>Amount</p>
                </div>
                <div className="flex justify-between font-normal sm:text-base text-sm">
                  <div className="flex gap-4">
                    <p>2024-9-16</p>
                    <p>Description</p>
                  </div>
                  <p>$1000</p>
                </div>
              </div>
              <div className="dark:bg-purple bg-primary_light rounded-md p-4">
                <div
                  className={`flex justify-between sm:text-base text-sm ${roboto_condensed.className}`}
                >
                  <p>Date</p>
                  <p>Amount</p>
                </div>
                <div className="flex justify-between font-normal sm:text-base text-sm">
                  <div className="flex gap-4">
                    <p>2024-9-16</p>
                    <p>Description</p>
                  </div>
                  <p>$1000</p>
                </div>
              </div>
              <div className="dark:bg-purple bg-primary_light rounded-md p-4">
                <div
                  className={`flex justify-between sm:text-base text-sm ${roboto_condensed.className}`}
                >
                  <p>Date</p>
                  <p>Amount</p>
                </div>
                <div className="flex justify-between font-normal sm:text-base text-sm">
                  <div className="flex gap-4">
                    <p>2024-9-16</p>
                    <p>Description</p>
                  </div>
                  <p>$1000</p>
                </div>
              </div>
              <div className="dark:bg-purple bg-primary_light rounded-md p-4">
                <div
                  className={`flex justify-between sm:text-base text-sm ${roboto_condensed.className}`}
                >
                  <p>Date</p>
                  <p>Amount</p>
                </div>
                <div className="flex justify-between font-normal sm:text-base text-sm">
                  <div className="flex gap-4">
                    <p>2024-9-16</p>
                    <p>Description</p>
                  </div>
                  <p>$1000</p>
                </div>
              </div>
              <div className="dark:bg-purple bg-primary_light rounded-md p-4">
                <div
                  className={`flex justify-between sm:text-base text-sm ${roboto_condensed.className}`}
                >
                  <p>Date</p>
                  <p>Amount</p>
                </div>
                <div className="flex justify-between font-normal sm:text-base text-sm">
                  <div className="flex gap-4">
                    <p>2024-9-16</p>
                    <p>Description</p>
                  </div>
                  <p>$1000</p>
                </div>
              </div>
              <div className="dark:bg-purple bg-primary_light rounded-md p-4">
                <div
                  className={`flex justify-between sm:text-base text-sm ${roboto_condensed.className}`}
                >
                  <p>Date</p>
                  <p>Amount</p>
                </div>
                <div className="flex justify-between font-normal sm:text-base text-sm">
                  <div className="flex gap-4">
                    <p>2024-9-16</p>
                    <p>Description</p>
                  </div>
                  <p>$1000</p>
                </div>
              </div>
              <div className="dark:bg-purple bg-primary_light rounded-md p-4">
                <div
                  className={`flex justify-between sm:text-base text-sm ${roboto_condensed.className}`}
                >
                  <p>Date</p>
                  <p>Amount</p>
                </div>
                <div className="flex justify-between font-normal sm:text-base text-sm">
                  <div className="flex gap-4">
                    <p>2024-9-16</p>
                    <p>Description</p>
                  </div>
                  <p>$1000</p>
                </div>
              </div>
              <div className="dark:bg-purple bg-primary_light rounded-md p-4">
                <div
                  className={`flex justify-between sm:text-base text-sm ${roboto_condensed.className}`}
                >
                  <p>Date</p>
                  <p>Amount</p>
                </div>
                <div className="flex justify-between font-normal sm:text-base text-sm">
                  <div className="flex gap-4">
                    <p>2024-9-16</p>
                    <p>Description</p>
                  </div>
                  <p>$1000</p>
                </div>
              </div>
              <div className="dark:bg-purple bg-primary_light rounded-md p-4">
                <div
                  className={`flex justify-between sm:text-base text-sm ${roboto_condensed.className}`}
                >
                  <p>Date</p>
                  <p>Amount</p>
                </div>
                <div className="flex justify-between font-normal sm:text-base text-sm">
                  <div className="flex gap-4">
                    <p>2024-9-16</p>
                    <p>Description</p>
                  </div>
                  <p>$1000</p>
                </div>
              </div>
              <div className="dark:bg-purple bg-primary_light rounded-md p-4">
                <div
                  className={`flex justify-between sm:text-base text-sm ${roboto_condensed.className}`}
                >
                  <p>Date</p>
                  <p>Amount</p>
                </div>
                <div className="flex justify-between font-normal sm:text-base text-sm">
                  <div className="flex gap-4">
                    <p>2024-9-16</p>
                    <p>Description</p>
                  </div>
                  <p>$1000</p>
                </div>
              </div>
              <div className="dark:bg-purple bg-primary_light rounded-md p-4">
                <div
                  className={`flex justify-between sm:text-base text-sm ${roboto_condensed.className}`}
                >
                  <p>Date</p>
                  <p>Amount</p>
                </div>
                <div className="flex justify-between font-normal sm:text-base text-sm">
                  <div className="flex gap-4">
                    <p>2024-9-16</p>
                    <p>Description</p>
                  </div>
                  <p>$1000</p>
                </div>
              </div>
              <div className="dark:bg-purple bg-primary_light rounded-md p-4">
                <div
                  className={`flex justify-between sm:text-base text-sm ${roboto_condensed.className}`}
                >
                  <p>Date</p>
                  <p>Amount</p>
                </div>
                <div className="flex justify-between font-normal sm:text-base text-sm">
                  <div className="flex gap-4">
                    <p>2024-9-16</p>
                    <p>Description</p>
                  </div>
                  <p>$1000</p>
                </div>
              </div>
              <div className="dark:bg-purple bg-primary_light rounded-md p-4">
                <div
                  className={`flex justify-between sm:text-base text-sm ${roboto_condensed.className}`}
                >
                  <p>Date</p>
                  <p>Amount</p>
                </div>
                <div className="flex justify-between font-normal sm:text-base text-sm">
                  <div className="flex gap-4">
                    <p>2024-9-16</p>
                    <p>Description</p>
                  </div>
                  <p>$1000</p>
                </div>
              </div>
              <div className="dark:bg-purple bg-primary_light rounded-md p-4">
                <div
                  className={`flex justify-between sm:text-base text-sm ${roboto_condensed.className}`}
                >
                  <p>Date</p>
                  <p>Amount</p>
                </div>
                <div className="flex justify-between font-normal sm:text-base text-sm">
                  <div className="flex gap-4">
                    <p>2024-9-16</p>
                    <p>Description</p>
                  </div>
                  <p>$1000</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
