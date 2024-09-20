"use client";

import { axiosPrivate } from "@/axios/axios";
import { UserBasicInfoType, UserProfileType } from "@/types/types";
import { Inria_Sans } from "next/font/google";
import { Roboto_Condensed } from "next/font/google";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CiUser } from "react-icons/ci";
import { FaUser } from "react-icons/fa";

const inria_sans = Inria_Sans({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
});
const roboto_condensed = Roboto_Condensed({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const Page = ({ params }: { params: { userId: string[] } }) => {
  const [userProfile, setUserProfile] = useState<UserProfileType>();
  const [userBasicInfo, setUserBasicInfo] = useState<UserBasicInfoType>();
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(true);
  const [isLoadingBasicInfo, setIsLoadingBasicInfo] = useState<boolean>(true);

  const fetchUserProfile = async () => {
    setIsLoadingProfile(true);
    try {
      const res = await axiosPrivate.get(
        `/admin/user/profile/${params.userId}/`
      );
      // console.log(res.data.data);
      setUserProfile(res.data.data);
    } catch (error) {
      console.log("Error fetching User Profile", error);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const fetchUserBasicInfo = async () => {
    setIsLoadingBasicInfo(true);
    try {
      const res = await axiosPrivate.get(
        `/admin/user/basic-info/${params.userId}/`
      );
      // console.log(res.data.data);
      setUserBasicInfo(res.data.data);
    } catch (error) {
      console.log("Error fetching User Info", error);
    } finally {
      setIsLoadingBasicInfo(false);
    }
  };

  useEffect(() => {
    fetchUserBasicInfo();
    fetchUserProfile();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <h1
        className={`text-bg_orange sm:text-3xl text-xl font-medium ${inria_sans.className}`}
      >
        User Details
      </h1>

      {isLoadingProfile || isLoadingBasicInfo ? (
        <div>Loading...</div>
      ) : (
        <div className="grid sm:grid-cols-2 grid-cols-1 sm:gap-8 gap-4">
          <Tabs defaultValue="basic" className="">
            <div className="">
              <TabsList>
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="personal">Personal</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="basic">
              <div className="flex flex-col sm:gap-8 gap-4">
                <div className="dark:bg-dark_gray bg-white sm:p-8 p-4 rounded-md flex flex-col gap-2">
                  <div className="flex items-center gap-2 border-b border-b-vl_gray ">
                    <h2
                      className={`text-bg_orange sm:text-2xl text-lg font-medium ${inria_sans.className}  sm:pb-2`}
                    >
                      User
                    </h2>
                    <FaUser size={23} className="pb-1 font-semibold" />
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
                      {userProfile?.id}
                    </p>
                  </div>
                </div>
                <div className="dark:bg-dark_gray bg-white  sm:p-8 p-4 rounded-md flex flex-col gap-4">
                  <h2
                    className={`text-bg_orange sm:text-2xl text-lg font-medium ${inria_sans.className} border-b border-b-vl_gray sm:pb-2`}
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
            <TabsContent value="personal">
              <div className="flex flex-col sm:gap-8 gap-4">
                <div className="dark:bg-dark_gray bg-white  sm:p-8 p-4 rounded-md flex flex-col gap-4">
                  <h2
                    className={`text-bg_orange sm:text-2xl text-lg font-medium ${inria_sans.className} border-b border-b-vl_gray sm:pb-2`}
                  >
                    Personal Detail
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
              </div>
            </TabsContent>
          </Tabs>

          <div className="dark:bg-dark_gray bg-white  sm:py-8 sm:pr-4 sm:pl-8 pl-4 py-4 pr-2 rounded-md flex flex-col gap-4 mt-12">
            <h2
              className={`text-bg_orange sm:text-2xl text-lg font-medium ${inria_sans.className} border-b border-b-vl_gray sm:pb-2`}
            >
              Transaction Detail
            </h2>
            <div className="overflow-y-auto">
              <div className="sm:h-[100vh] h-[50vh] flex flex-col gap-4 pr-4">
                <div className="dark:bg-purple bg-gray rounded-md p-4">
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
                <div className="dark:bg-purple bg-gray rounded-md p-4">
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
                <div className="dark:bg-purple bg-gray rounded-md p-4">
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
                <div className="dark:bg-purple bg-gray rounded-md p-4">
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
                <div className="dark:bg-purple bg-gray rounded-md p-4">
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
                <div className="dark:bg-purple bg-gray rounded-md p-4">
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
                <div className="dark:bg-purple bg-gray rounded-md p-4">
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
                <div className="dark:bg-purple bg-gray rounded-md p-4">
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
                <div className="dark:bg-purple bg-gray rounded-md p-4">
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
                <div className="dark:bg-purple bg-gray rounded-md p-4">
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
                <div className="dark:bg-purple bg-gray rounded-md p-4">
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
                <div className="dark:bg-purple bg-gray rounded-md p-4">
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
                <div className="dark:bg-purple bg-gray rounded-md p-4">
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
                <div className="dark:bg-purple bg-gray rounded-md p-4">
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
                <div className="dark:bg-purple bg-gray rounded-md p-4">
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
      )}
    </div>
  );
};

export default Page;
