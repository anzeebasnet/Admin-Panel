"use client";

import { axiosPrivate } from "@/axios/axios";
import { UserBasicInfoType, UserKYCType, UserProfileType } from "@/types/types";
import { Inria_Sans } from "next/font/google";
import { Roboto_Condensed } from "next/font/google";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaCircleUser } from "react-icons/fa6";
import axios from "axios";
import Image from "next/image";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CgArrowLeft } from "react-icons/cg";

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
  const [userKYC, setUserKYC] = useState<UserKYCType>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchUserProfile = async () => {
    setIsLoading(true);
    try {
      const res = await axiosPrivate.get(
        `/admin/user/profile/${params.userId}/`
      );
      // console.log(res.data.data);
      setUserProfile(res.data.data);
    } catch (error) {
      console.log("Error fetching User Profile", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserBasicInfo = async () => {
    setIsLoading(true);
    try {
      const res = await axiosPrivate.get(
        `/admin/user/basic-info/${params.userId}/`
      );
      // console.log(res.data.data);
      setUserBasicInfo(res.data.data);
    } catch (error) {
      console.log("Error fetching User Info", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserKyc = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `http://192.168.1.73:8001/api/admin/kyc/${params.userId}/list/`
      );
      setUserKYC(res.data.data);
    } catch (error) {
      console.log("Error fetching user KYC information", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserBasicInfo();
    fetchUserProfile();
    fetchUserKyc();
  }, []);

  return (
    <div className="flex flex-col gap-4 bg-white dark:bg-secondary_dark rounded-sm p-6 shadow-sm shadow-vll_gray dark:shadow-none">
      <Breadcrumb className="mb-4 -ml-1">
        <BreadcrumbList className="flex sm:gap-1">
          <BreadcrumbItem>
            <BreadcrumbLink href={`/users`}>
              <CgArrowLeft
                className="text-primary_text dark:text-sidebar_blue"
                size={25}
              />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbPage className="sm:text-xl text-sm font-medium text-primary_text dark:text-sidebar_blue">
              Users
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-y-auto">
          <Tabs
            defaultValue="basic"
            className="grid sm:grid-cols-3 grid-cols-1 gap-4 "
          >
            <div className="sm:col-span-1 flex flex-col gap-4">
              <div className="dark:bg-primary_dark bg-white sm:p-6 p-4 rounded-md flex flex-col gap-4 shadow-md shadow-vll_gray dark:shadow-none">
                <FaCircleUser size={80} />
                <div>
                  <p
                    className={`text-sm  ${roboto_condensed.className} capitalize`}
                  >
                    {userBasicInfo?.first_name} {userBasicInfo?.last_name}
                  </p>
                  <p className={`text-sm  ${roboto_condensed.className}`}>
                    {userBasicInfo?.email}
                  </p>
                  <p
                    className={`text-sm  ${roboto_condensed.className} capitalize`}
                  >
                    {userBasicInfo?.username}
                  </p>
                </div>
              </div>
              <TabsList className="flex flex-col items-center justify-center gap-2 dark:bg-primary_dark bg-white p-6 shadow-md shadow-vll_gray dark:shadow-none rounded-md data-[state=active]:bg-primary_text">
                <TabsTrigger
                  className="w-full  bg-primary_light dark:bg-vl_gray text-card_dark dark:text-white data-[state=active]:bg-primary_text data-[state=active]:text-white data-[state=active]:dark:bg-secondary_text"
                  value="basic"
                >
                  Basic
                </TabsTrigger>
                <TabsTrigger
                  className="w-full  bg-primary_light dark:bg-vl_gray text-card_dark dark:text-white  data-[state=active]:bg-primary_text data-[state=active]:text-white data-[state=active]:dark:bg-secondary_text"
                  value="personal"
                >
                  Personal
                </TabsTrigger>
                <TabsTrigger
                  className="w-full  bg-primary_light dark:bg-vl_gray text-card_dark dark:text-white  data-[state=active]:bg-primary_text data-[state=active]:text-white data-[state=active]:dark:bg-secondary_text"
                  value="userKyc"
                >
                  User KYC
                </TabsTrigger>
                <TabsTrigger
                  className="w-full  bg-primary_light dark:bg-vl_gray text-card_dark dark:text-white  data-[state=active]:bg-primary_text data-[state=active]:text-white data-[state=active]:dark:bg-secondary_text"
                  value="wallets"
                >
                  Wallets
                </TabsTrigger>
                <TabsTrigger
                  className="w-full  bg-primary_light dark:bg-vl_gray text-card_dark dark:text-white  data-[state=active]:bg-primary_text data-[state=active]:text-white data-[state=active]:dark:bg-secondary_text"
                  value="userWithdrawl"
                >
                  User Withdrawl
                </TabsTrigger>
                <TabsTrigger
                  className="w-full  bg-primary_light dark:bg-vl_gray text-card_dark dark:text-white  data-[state=active]:bg-primary_text data-[state=active]:text-white data-[state=active]:dark:bg-secondary_text"
                  value="userReferral"
                >
                  User Referral
                </TabsTrigger>
                <TabsTrigger
                  className="w-full  bg-primary_light dark:bg-vl_gray text-card_dark dark:text-white  data-[state=active]:bg-primary_text data-[state=active]:text-white data-[state=active]:dark:bg-secondary_text"
                  value="userBusiness"
                >
                  User Business
                </TabsTrigger>
                <TabsTrigger
                  className="w-full  bg-primary_light dark:bg-vl_gray text-card_dark dark:text-white  data-[state=active]:bg-primary_text data-[state=active]:text-white data-[state=active]:dark:bg-secondary_text"
                  value="userBilling"
                >
                  User Billing
                </TabsTrigger>
                <TabsTrigger
                  className="w-full  bg-primary_light dark:bg-vl_gray text-card_dark dark:text-white  data-[state=active]:bg-primary_text data-[state=active]:text-white data-[state=active]:dark:bg-secondary_text"
                  value="membershipSubscription"
                >
                  Membership Subscription
                </TabsTrigger>
                <TabsTrigger
                  className="w-full  bg-primary_light dark:bg-vl_gray text-card_dark dark:text-white  data-[state=active]:bg-primary_text data-[state=active]:text-white data-[state=active]:dark:bg-secondary_text"
                  value="userEventBook"
                >
                  User Event Book
                </TabsTrigger>
              </TabsList>
            </div>
            <div className="sm:col-span-2 flex flex-col gap-4">
              <div className="shadow-md shadow-vll_gray dark:shadow-none rounded-md">
                <TabsContent value="basic">
                  <div className="dark:bg-primary_dark bg-white  sm:p-6 p-4 rounded-md flex flex-col gap-4">
                    <h2
                      className={`text-primary_text dark:text-sidebar_blue sm:text-xl text-lg font-medium ${inria_sans.className} border-b border-b-vl_gray sm:pb-2`}
                    >
                      Basic Detail
                    </h2>
                    <div className="overflow-y-auto">
                      <div
                        className={`flex flex-col gap-1  text-sm ${roboto_condensed.className}`}
                      >
                        <p className={` capitalize`}>
                          Full Name: {userBasicInfo?.first_name}
                          {userBasicInfo?.last_name}
                        </p>
                        <p>Username: {userBasicInfo?.username || "null"}</p>
                        <p>Email Address: {userBasicInfo?.email || "null"}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="personal">
                  <div className="dark:bg-primary_dark bg-white  sm:p-6 p-4 rounded-md flex flex-col gap-4">
                    <h2
                      className={`text-primary_text dark:text-sidebar_blue sm:text-xl text-lg font-medium ${inria_sans.className} border-b border-b-vl_gray sm:pb-2`}
                    >
                      Personal Detail
                    </h2>
                    <div className="overflow-y-auto">
                      <div className="flex gap-8">
                        <div
                          className={`flex flex-col gap-1 text-sm ${roboto_condensed.className}`}
                        >
                          <p>ID: {userBasicInfo?.user_profile?.id}</p>
                          <p className={` capitalize`}>
                            Full Name: {userBasicInfo?.first_name}
                            {userBasicInfo?.last_name}
                          </p>
                          <p>Username: {userBasicInfo?.username || "null"}</p>
                          <p>
                            Contact: {userBasicInfo?.phone_number || "null"}
                          </p>
                          <p>Email Address: {userBasicInfo?.email || "null"}</p>
                          <p>Status: {userBasicInfo?.status || "null"}</p>
                          <p>User Type: {userBasicInfo?.user_type || "null"}</p>
                          <p>
                            Gender:{" "}
                            {userBasicInfo?.user_profile?.gender || "null"}
                          </p>
                          <p>
                            D.O.B:{" "}
                            {userBasicInfo?.user_profile?.date_of_birth ||
                              "null"}
                          </p>
                          <p>
                            Country:{" "}
                            {userBasicInfo?.user_profile?.country || "null"}
                          </p>
                          <p>
                            Address:{" "}
                            {userBasicInfo?.user_profile?.address || "null"}
                          </p>
                          <p>
                            City: {userBasicInfo?.user_profile?.city || "null"}
                          </p>
                          <p>
                            Street:{" "}
                            {userBasicInfo?.user_profile?.street || "null"}
                          </p>
                          <p>
                            Zip Code:{" "}
                            {userBasicInfo?.user_profile?.zip_code || "null"}
                          </p>
                          <p>
                            House No.:{" "}
                            {userBasicInfo?.user_profile?.house_no || "null"}
                          </p>
                          <p>
                            Secondary Contact:{" "}
                            {userBasicInfo?.user_profile
                              ?.secondary_phone_number || "null"}
                          </p>
                          <p>
                            Secondary Email:{" "}
                            {userBasicInfo?.user_profile?.secondary_email ||
                              "null"}
                          </p>
                          <p>
                            Date Joined: {userBasicInfo?.date_joined || "null"}
                          </p>
                          <p>
                            Date Created: {userBasicInfo?.created || "null"}
                          </p>
                          <p>
                            Date Modified: {userBasicInfo?.modified || "null"}
                          </p>
                          <p>
                            Last Login: {userBasicInfo?.last_login || "null"}
                          </p>
                          <p>
                            Is SuperUser:{" "}
                            {userBasicInfo?.is_superuser ? "Yes" : "No"}
                          </p>
                          <p>
                            Is Staff: {userBasicInfo?.is_staff ? "Yes" : "No"}
                          </p>
                          <p>
                            Is Verified User:{" "}
                            {userBasicInfo?.is_verified_user ? "Yes" : "No"}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-4">
                          <div>
                            {userBasicInfo?.user_profile?.display_picture ? (
                              <Image
                                src={userBasicInfo.user_profile.display_picture}
                                alt="Display Picture"
                                width={200}
                                height={200}
                              />
                            ) : (
                              "This is the display picture"
                            )}
                          </div>
                          <div className="border-2 border-black h-[210px]">
                            {userBasicInfo?.user_profile?.qr_code ? (
                              <Image
                                src={userBasicInfo.user_profile.qr_code}
                                alt="QR Code"
                                width={200}
                                height={200}
                              />
                            ) : (
                              "This is the QR code"
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="userKyc">
                  <div className="dark:bg-primary_dark bg-white  sm:p-6 p-4 rounded-md flex flex-col gap-4">
                    <h2
                      className={`text-primary_text dark:text-sidebar_blue sm:text-xl text-lg font-medium ${inria_sans.className} 
                      border-b border-b-vl_gray sm:pb-2`}
                    >
                      User KYC
                    </h2>
                    <div className="overflow-y-auto">
                      <div
                        className={`flex flex-col gap-1 text-sm ${roboto_condensed.className}`}
                      >
                        <p>Id: {userKYC?.id || "null"}</p>
                        <p className={` capitalize`}>
                          Full Name: {userKYC?.user?.first_name}
                          {userKYC?.user?.last_name}
                        </p>
                        <p>Email Address: {userKYC?.user?.email || "null"}</p>
                        <p>Username: {userKYC?.user?.username || "null"}</p>
                        <p>Contact: {userKYC?.user?.phone_number || "null"}</p>
                        <p>
                          Marital Status: {userKYC?.marital_status || "null"}
                        </p>
                        <p>Occupation: {userKYC?.occupation || "null"}</p>
                        <p>
                          State Province: {userKYC?.state_province || "null"}
                        </p>
                        <p>City: {userKYC?.city || "null"}</p>
                        <p>Street: {userKYC?.street || "null"}</p>
                        <p>Postal Code: {userKYC?.postal_code || "null"}</p>
                        <p>
                          Secondary Contact: {userKYC?.alt_contact || "null"}
                        </p>
                        <p>Secondary Email: {userKYC?.alt_email || "null"}</p>
                        {userKYC?.document?.map((item, index) => {
                          return (
                            <div key={index}>
                              <p>
                                KYC Verification:{" "}
                                {item.kyc_verification || "null"}
                              </p>
                              <p>Document Id: {item.document_id || "null"}</p>
                              <p>
                                Document Type: {item.document_type || "null"}
                              </p>
                              <p>Issue Date: {item.issue_date || "null"}</p>
                              <div className="flex gap-2">
                                Document File:
                                <Image
                                  src={item.document_file}
                                  alt="document file"
                                  width={100}
                                  height={100}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="wallets">
                  <div className="dark:bg-primary_dark bg-white  sm:p-6 p-4 rounded-md flex flex-col gap-4">
                    <h2
                      className={`text-primary_text dark:text-sidebar_blue sm:text-xl text-lg font-medium ${inria_sans.className} border-b border-b-vl_gray sm:pb-2`}
                    >
                      Wallets
                    </h2>
                    <div className="overflow-y-auto">
                      <div
                        className={`flex flex-col gap-1 text-sm ${roboto_condensed.className}`}
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
                        <p>
                          Date of Birth: {userProfile?.date_of_birth || "null"}
                        </p>
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
                          Secondary Email:{" "}
                          {userProfile?.secondary_email || "null"}
                        </p>
                        <p>Date Created: {userBasicInfo?.created || "null"}</p>
                        <p>
                          Date Modified: {userBasicInfo?.modified || "null"}
                        </p>
                        <p>
                          Date Joined: {userBasicInfo?.date_joined || "null"}
                        </p>
                        <p>Last Login: {userBasicInfo?.last_login || "null"}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="userWithdrawl">
                  <div className="dark:bg-primary_dark bg-white  sm:p-6 p-4 rounded-md flex flex-col gap-4">
                    <h2
                      className={`text-primary_text dark:text-sidebar_blue sm:text-xl text-lg font-medium ${inria_sans.className} border-b border-b-vl_gray sm:pb-2`}
                    >
                      User Withdrawl
                    </h2>
                    <div className="overflow-y-auto">
                      <div
                        className={`flex flex-col gap-1 text-sm ${roboto_condensed.className}`}
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
                        <p>
                          Date of Birth: {userProfile?.date_of_birth || "null"}
                        </p>
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
                          Secondary Email:{" "}
                          {userProfile?.secondary_email || "null"}
                        </p>
                        <p>Date Created: {userBasicInfo?.created || "null"}</p>
                        <p>
                          Date Modified: {userBasicInfo?.modified || "null"}
                        </p>
                        <p>
                          Date Joined: {userBasicInfo?.date_joined || "null"}
                        </p>
                        <p>Last Login: {userBasicInfo?.last_login || "null"}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="userReferral">
                  <div className="dark:bg-primary_dark bg-white  sm:p-6 p-4 rounded-md flex flex-col gap-4">
                    <h2
                      className={`text-primary_text dark:text-sidebar_blue sm:text-xl text-lg font-medium ${inria_sans.className} border-b border-b-vl_gray sm:pb-2`}
                    >
                      User Referral
                    </h2>
                    <div className="overflow-y-auto">
                      <div
                        className={`flex flex-col gap-1 text-sm ${roboto_condensed.className}`}
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
                        <p>
                          Date of Birth: {userProfile?.date_of_birth || "null"}
                        </p>
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
                          Secondary Email:{" "}
                          {userProfile?.secondary_email || "null"}
                        </p>
                        <p>Date Created: {userBasicInfo?.created || "null"}</p>
                        <p>
                          Date Modified: {userBasicInfo?.modified || "null"}
                        </p>
                        <p>
                          Date Joined: {userBasicInfo?.date_joined || "null"}
                        </p>
                        <p>Last Login: {userBasicInfo?.last_login || "null"}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="userBusiness">
                  <div className="dark:bg-primary_dark bg-white  sm:p-6 p-4 rounded-md flex flex-col gap-4">
                    <h2
                      className={`text-primary_text dark:text-sidebar_blue sm:text-xl text-lg font-medium ${inria_sans.className} border-b border-b-vl_gray sm:pb-2`}
                    >
                      User Business
                    </h2>
                    <div className="overflow-y-auto">
                      <div
                        className={`flex flex-col gap-1 text-sm ${roboto_condensed.className}`}
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
                        <p>
                          Date of Birth: {userProfile?.date_of_birth || "null"}
                        </p>
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
                          Secondary Email:{" "}
                          {userProfile?.secondary_email || "null"}
                        </p>
                        <p>Date Created: {userBasicInfo?.created || "null"}</p>
                        <p>
                          Date Modified: {userBasicInfo?.modified || "null"}
                        </p>
                        <p>
                          Date Joined: {userBasicInfo?.date_joined || "null"}
                        </p>
                        <p>Last Login: {userBasicInfo?.last_login || "null"}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="userBilling">
                  <div className="dark:bg-primary_dark bg-white  sm:p-6 p-4 rounded-md flex flex-col gap-4">
                    <h2
                      className={`text-primary_text dark:text-sidebar_blue sm:text-xl text-lg font-medium ${inria_sans.className} border-b border-b-vl_gray sm:pb-2`}
                    >
                      User Billing
                    </h2>
                    <div className="overflow-y-auto">
                      <div
                        className={`flex flex-col gap-1 text-sm ${roboto_condensed.className}`}
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
                        <p>
                          Date of Birth: {userProfile?.date_of_birth || "null"}
                        </p>
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
                          Secondary Email:{" "}
                          {userProfile?.secondary_email || "null"}
                        </p>
                        <p>Date Created: {userBasicInfo?.created || "null"}</p>
                        <p>
                          Date Modified: {userBasicInfo?.modified || "null"}
                        </p>
                        <p>
                          Date Joined: {userBasicInfo?.date_joined || "null"}
                        </p>
                        <p>Last Login: {userBasicInfo?.last_login || "null"}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="membershipSubscription">
                  <div className="dark:bg-primary_dark bg-white  sm:p-6 p-4 rounded-md flex flex-col gap-4">
                    <h2
                      className={`text-primary_text dark:text-sidebar_blue sm:text-xl text-lg font-medium ${inria_sans.className} border-b border-b-vl_gray sm:pb-2`}
                    >
                      Membership Subscription
                    </h2>
                    <div className="overflow-y-auto">
                      <div
                        className={`flex flex-col gap-1 text-sm ${roboto_condensed.className}`}
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
                        <p>
                          Date of Birth: {userProfile?.date_of_birth || "null"}
                        </p>
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
                          Secondary Email:{" "}
                          {userProfile?.secondary_email || "null"}
                        </p>
                        <p>Date Created: {userBasicInfo?.created || "null"}</p>
                        <p>
                          Date Modified: {userBasicInfo?.modified || "null"}
                        </p>
                        <p>
                          Date Joined: {userBasicInfo?.date_joined || "null"}
                        </p>
                        <p>Last Login: {userBasicInfo?.last_login || "null"}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="userEventBook">
                  <div className="dark:bg-primary_dark bg-white  sm:p-6 p-4 rounded-md flex flex-col gap-4">
                    <h2
                      className={`text-primary_text dark:text-sidebar_blue sm:text-xl text-lg font-medium ${inria_sans.className} border-b border-b-vl_gray sm:pb-2`}
                    >
                      User Event Book
                    </h2>
                    <div className="overflow-y-auto">
                      <div
                        className={`flex flex-col gap-1 text-sm ${roboto_condensed.className}`}
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
                        <p>
                          Date of Birth: {userProfile?.date_of_birth || "null"}
                        </p>
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
                          Secondary Email:{" "}
                          {userProfile?.secondary_email || "null"}
                        </p>
                        <p>Date Created: {userBasicInfo?.created || "null"}</p>
                        <p>
                          Date Modified: {userBasicInfo?.modified || "null"}
                        </p>
                        <p>
                          Date Joined: {userBasicInfo?.date_joined || "null"}
                        </p>
                        <p>Last Login: {userBasicInfo?.last_login || "null"}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </div>
              {/* <div className="dark:bg-primary_dark bg-white  sm:py-6 sm:pr-4 sm:pl-6 pl-4 py-4 pr-2 rounded-md flex flex-col gap-4 shadow-md shadow-vll_gray dark:shadow-none">
                <h2
                  className={`text-primary_text dark:text-sidebar_blue sm:text-xl text-lg font-medium ${inria_sans.className} border-b border-b-vl_gray sm:pb-2`}
                >
                  Transaction Detail
                </h2>
                <div className="overflow-y-auto">
                  <div className="h-[40vh] flex flex-col gap-4 pr-4">
                    <div className="dark:bg-purple bg-primary_light rounded-md p-4">
                      <div
                        className={`flex justify-between  text-sm ${roboto_condensed.className}`}
                      >
                        <p>Date</p>
                        <p>Amount</p>
                      </div>
                      <div className="flex justify-between font-normal  text-sm">
                        <div className="flex gap-4">
                          <p>2024-9-16</p>
                          <p>Description</p>
                        </div>
                        <p>$1000</p>
                      </div>
                    </div>
                    <div className="dark:bg-purple bg-primary_light rounded-md p-4">
                      <div
                        className={`flex justify-between  text-sm ${roboto_condensed.className}`}
                      >
                        <p>Date</p>
                        <p>Amount</p>
                      </div>
                      <div className="flex justify-between font-normal  text-sm">
                        <div className="flex gap-4">
                          <p>2024-9-16</p>
                          <p>Description</p>
                        </div>
                        <p>$1000</p>
                      </div>
                    </div>
                    <div className="dark:bg-purple bg-primary_light rounded-md p-4">
                      <div
                        className={`flex justify-between  text-sm ${roboto_condensed.className}`}
                      >
                        <p>Date</p>
                        <p>Amount</p>
                      </div>
                      <div className="flex justify-between font-normal  text-sm">
                        <div className="flex gap-4">
                          <p>2024-9-16</p>
                          <p>Description</p>
                        </div>
                        <p>$1000</p>
                      </div>
                    </div>
                    <div className="dark:bg-purple bg-primary_light rounded-md p-4">
                      <div
                        className={`flex justify-between  text-sm ${roboto_condensed.className}`}
                      >
                        <p>Date</p>
                        <p>Amount</p>
                      </div>
                      <div className="flex justify-between font-normal  text-sm">
                        <div className="flex gap-4">
                          <p>2024-9-16</p>
                          <p>Description</p>
                        </div>
                        <p>$1000</p>
                      </div>
                    </div>
                    <div className="dark:bg-purple bg-primary_light rounded-md p-4">
                      <div
                        className={`flex justify-between  text-sm ${roboto_condensed.className}`}
                      >
                        <p>Date</p>
                        <p>Amount</p>
                      </div>
                      <div className="flex justify-between font-normal  text-sm">
                        <div className="flex gap-4">
                          <p>2024-9-16</p>
                          <p>Description</p>
                        </div>
                        <p>$1000</p>
                      </div>
                    </div>
                    <div className="dark:bg-purple bg-primary_light rounded-md p-4">
                      <div
                        className={`flex justify-between  text-sm ${roboto_condensed.className}`}
                      >
                        <p>Date</p>
                        <p>Amount</p>
                      </div>
                      <div className="flex justify-between font-normal  text-sm">
                        <div className="flex gap-4">
                          <p>2024-9-16</p>
                          <p>Description</p>
                        </div>
                        <p>$1000</p>
                      </div>
                    </div>
                    <div className="dark:bg-purple bg-primary_light rounded-md p-4">
                      <div
                        className={`flex justify-between  text-sm ${roboto_condensed.className}`}
                      >
                        <p>Date</p>
                        <p>Amount</p>
                      </div>
                      <div className="flex justify-between font-normal  text-sm">
                        <div className="flex gap-4">
                          <p>2024-9-16</p>
                          <p>Description</p>
                        </div>
                        <p>$1000</p>
                      </div>
                    </div>
                    <div className="dark:bg-purple bg-primary_light rounded-md p-4">
                      <div
                        className={`flex justify-between  text-sm ${roboto_condensed.className}`}
                      >
                        <p>Date</p>
                        <p>Amount</p>
                      </div>
                      <div className="flex justify-between font-normal  text-sm">
                        <div className="flex gap-4">
                          <p>2024-9-16</p>
                          <p>Description</p>
                        </div>
                        <p>$1000</p>
                      </div>
                    </div>
                    <div className="dark:bg-purple bg-primary_light rounded-md p-4">
                      <div
                        className={`flex justify-between  text-sm ${roboto_condensed.className}`}
                      >
                        <p>Date</p>
                        <p>Amount</p>
                      </div>
                      <div className="flex justify-between font-normal  text-sm">
                        <div className="flex gap-4">
                          <p>2024-9-16</p>
                          <p>Description</p>
                        </div>
                        <p>$1000</p>
                      </div>
                    </div>
                    <div className="dark:bg-purple bg-primary_light rounded-md p-4">
                      <div
                        className={`flex justify-between  text-sm ${roboto_condensed.className}`}
                      >
                        <p>Date</p>
                        <p>Amount</p>
                      </div>
                      <div className="flex justify-between font-normal  text-sm">
                        <div className="flex gap-4">
                          <p>2024-9-16</p>
                          <p>Description</p>
                        </div>
                        <p>$1000</p>
                      </div>
                    </div>
                    <div className="dark:bg-purple bg-primary_light rounded-md p-4">
                      <div
                        className={`flex justify-between  text-sm ${roboto_condensed.className}`}
                      >
                        <p>Date</p>
                        <p>Amount</p>
                      </div>
                      <div className="flex justify-between font-normal  text-sm">
                        <div className="flex gap-4">
                          <p>2024-9-16</p>
                          <p>Description</p>
                        </div>
                        <p>$1000</p>
                      </div>
                    </div>
                    <div className="dark:bg-purple bg-primary_light rounded-md p-4">
                      <div
                        className={`flex justify-between  text-sm ${roboto_condensed.className}`}
                      >
                        <p>Date</p>
                        <p>Amount</p>
                      </div>
                      <div className="flex justify-between font-normal  text-sm">
                        <div className="flex gap-4">
                          <p>2024-9-16</p>
                          <p>Description</p>
                        </div>
                        <p>$1000</p>
                      </div>
                    </div>
                    <div className="dark:bg-purple bg-primary_light rounded-md p-4">
                      <div
                        className={`flex justify-between  text-sm ${roboto_condensed.className}`}
                      >
                        <p>Date</p>
                        <p>Amount</p>
                      </div>
                      <div className="flex justify-between font-normal  text-sm">
                        <div className="flex gap-4">
                          <p>2024-9-16</p>
                          <p>Description</p>
                        </div>
                        <p>$1000</p>
                      </div>
                    </div>
                    <div className="dark:bg-purple bg-primary_light rounded-md p-4">
                      <div
                        className={`flex justify-between  text-sm ${roboto_condensed.className}`}
                      >
                        <p>Date</p>
                        <p>Amount</p>
                      </div>
                      <div className="flex justify-between font-normal  text-sm">
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
              </div> */}
            </div>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default Page;
