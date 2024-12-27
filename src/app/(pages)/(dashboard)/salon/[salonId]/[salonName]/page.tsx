"use client";

import { useSalonDetail } from "@/lib/react-query/queriesAndMutations";
import { setSalonData } from "@/lib/store/features/salonDetailSlice/salonDetailSlice";
import { useAppSelector } from "@/lib/store/hooks";
import { RootState } from "@/lib/store/store";
import { Open_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { IoIosMail } from "react-icons/io";
import { IoLocationSharp, IoLogoInstagram } from "react-icons/io5";
import { MdFacebook, MdLocalPhone } from "react-icons/md";
import { useDispatch } from "react-redux";
import { Separator } from "@/components/ui/separator";
import { GoLink } from "react-icons/go";
import { FiEdit3 } from "react-icons/fi";
import { CiEdit } from "react-icons/ci";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CgArrowLeft } from "react-icons/cg";
import { Skeleton } from "@/components/ui/skeleton";

const open_sans = Open_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const Page = ({
  params,
}: {
  params: { salonId: string; salonName: string };
}) => {
  const salonData = useAppSelector(
    (state: RootState) => state.salon.currentSalon
  );
  const dispatch = useDispatch();
  const SalonName = decodeURIComponent(params.salonName);
  const { data: salonDetail, isLoading: isLoading } = useSalonDetail(
    params.salonId
  );

  useEffect(() => {
    if (salonDetail) {
      dispatch(setSalonData(salonDetail));
    }
  }, [salonDetail, dispatch]);

  return (
    <div
      className={` bg-white dark:bg-secondary_dark rounded-sm p-6 flex flex-col gap-6 shadow-sm shadow-vll_gray dark:shadow-none ${open_sans.className}`}
    >
      <Breadcrumb className="mb-4 -ml-1">
        <BreadcrumbList className="flex sm:gap-1">
          <BreadcrumbItem>
            <BreadcrumbLink href={`/salon`}>
              <CgArrowLeft
                className="text-primary_text dark:text-sidebar_blue"
                size={25}
              />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbPage className="sm:text-xl text-sm font-medium text-primary_text dark:text-sidebar_blue">
              {SalonName}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-5 ">
        {isLoading ? (
          <div className="flex flex-col gap-8 ">
            <div className="grid lg:grid-cols-2 grid-cols-1 sm:gap-6 gap-4">
              <div className="flex flex-col sm:gap-4 gap-2">
                <Skeleton className="dark:bg-[#575b82]  bg-[#cccccc] h-[15vh] w-[15vh] rounded-full" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="dark:bg-[#575b82]  bg-[#cccccc] h-[3vh] w-[20vh] rounded-md" />
                  <Skeleton className="dark:bg-[#575b82]  bg-[#cccccc] h-[3vh] sm:w-[35vh] w-[25vh] rounded-md" />
                  <Skeleton className="dark:bg-[#575b82]  bg-[#cccccc] h-[3vh] sm:w-[40vh] w-[30vh] rounded-md" />
                  <Skeleton className="dark:bg-[#575b82]  bg-[#cccccc] h-[3vh] sm:w-[45vh] w-[35vh] rounded-md" />
                  <Skeleton className="dark:bg-[#575b82]  bg-[#cccccc] h-[6vh] sm:w-[60vh] w-[40vh] rounded-sm" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="dark:bg-[#575b82]  bg-[#cccccc] h-[3vh] sm:w-[16vh] w-[10vh] rounded-sm" />
                  <Skeleton className="dark:bg-[#575b82]  bg-[#cccccc] h-[3vh] sm:w-[16vh] w-[10vh] rounded-sm" />
                  <Skeleton className="dark:bg-[#575b82]  bg-[#cccccc] h-[3vh] sm:w-[16vh] w-[10vh] rounded-sm" />
                </div>
              </div>
              <Skeleton className="dark:bg-[#575b82]  bg-[#cccccc] sm:w-[35vw] w-[80vw] sm:h-[40vh] h-[20vh] rounded-sm" />
            </div>
            <div className="sm:flex sm:flex-wrap hidden gap-4">
              <Skeleton className="dark:bg-[#575b82]  bg-[#cccccc] h-[20vh] w-[20vh] rounded-sm" />
              <Skeleton className="dark:bg-[#575b82]  bg-[#cccccc] h-[20vh] w-[20vh] rounded-sm" />
              <Skeleton className="dark:bg-[#575b82]  bg-[#cccccc] h-[20vh] w-[20vh] rounded-sm" />
              <Skeleton className="dark:bg-[#575b82]  bg-[#cccccc] h-[20vh] w-[20vh] rounded-sm" />
              <Skeleton className="dark:bg-[#575b82]  bg-[#cccccc] h-[20vh] w-[20vh] rounded-sm" />
            </div>
          </div>
        ) : !salonDetail ? (
          <p>Salon Detail not found!</p>
        ) : salonDetail ? (
          <div className="flex flex-col sm:gap-12 gap-4">
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-8">
              <div className="flex flex-col gap-4">
                <Image
                  src={salonDetail.logo}
                  alt="salon logo"
                  width={100}
                  height={100}
                  className="rounded-full w-36 h-36"
                />
                <div className="flex flex-col gap-2">
                  <div className=" flex items-center gap-1">
                    <h2
                      className={`text-deep_red dark:text-white sm:text-xl text-lg font-semibold`}
                    >
                      {salonDetail.name}
                    </h2>
                    {salonData ? (
                      <Link href={`/salon/create`} className="place-self-end">
                        <CiEdit
                          size={24}
                          className="text-deep_red dark:text-white"
                        />
                      </Link>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="flex gap-1 items-end">
                    <IoLocationSharp
                      size={22}
                      className="text-primary_text dark:text-sidebar_blue"
                    />
                    <p className="text-sm font-medium">{salonDetail.address}</p>
                  </div>
                  <div className="flex sm:flex-row flex-col gap-2">
                    <div className="flex gap-1 items-end ">
                      <MdLocalPhone
                        size={22}
                        className="text-primary_text dark:text-sidebar_blue"
                      />
                      <p className="text-sm font-medium ">
                        {salonDetail.contact_no}
                      </p>
                    </div>
                    <Separator
                      orientation="vertical"
                      color="black"
                      className="bg-gray-400 w-[2px] sm:block hidden"
                    />
                    <div className="flex gap-1 items-end ">
                      <IoIosMail
                        size={22}
                        className="text-primary_text dark:text-sidebar_blue"
                      />
                      <p className="text-sm font-medium ">
                        {salonDetail.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 items-end ">
                    {salonDetail.amenities.map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-wrap items-end gap-1"
                      >
                        <p className="text-sm font-medium capitalize">{item}</p>
                        {index < salonDetail.amenities.length - 1 && (
                          <p className="text-gray-500">|</p>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm font-medium ">
                    {salonDetail.short_description}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-4 ">
                  <Link
                    href={`${salonDetail.facebook_link}`}
                    className="bg-primary_text dark:bg-btn_blue text-white text-[13px] hover:bg-l_orange dark:hover:bg-blue py-1 px-4 rounded inline-flex gap-2 items-center"
                  >
                    <MdFacebook size={18} />
                    Facebook
                  </Link>
                  <Link
                    href={`${salonDetail.instagram_link}`}
                    className="bg-primary_text dark:bg-btn_blue text-white text-[13px] hover:bg-l_orange dark:hover:bg-blue py-1 px-4 rounded inline-flex gap-2 items-center"
                  >
                    <IoLogoInstagram size={18} />
                    Instagram
                  </Link>
                  <Link
                    href={`${salonDetail.website_link}`}
                    className="bg-primary_text dark:bg-btn_blue text-white text-[13px] hover:bg-l_orange dark:hover:bg-blue py-1 px-4 rounded inline-flex gap-2"
                  >
                    <GoLink size={18} />
                    Website
                  </Link>
                </div>
              </div>
              <div className="flex items-center h-full">
                <Image
                  src={salonDetail?.banner || ""}
                  alt="salon banner"
                  width={500}
                  height={500}
                  className="rounded w-[35rem] h-80"
                />
              </div>
            </div>
            <div className="inline-flex flex-wrap gap-4 ">
              <Link
                href={`/salon/${params.salonId}/${params.salonName}/services`}
                className="flex flex-col justify-center gap-2 items-center w-40 h-40 bg-beige hover:bg-l_orange dark:bg-blue dark:hover:bg-sidebar_blue text-deep_red hover:text-white  dark:text-white rounded"
              >
                <Image
                  src={"/images/services.png"}
                  alt="menu"
                  width={200}
                  height={200}
                  className="w-16 h-16 rounded"
                />
                <p className="text-sm font-semibold">Services</p>
              </Link>
              <Link
                href={`/salon/${params.salonId}/${params.salonName}/staff`}
                className="flex flex-col justify-center gap-2 items-center w-40 h-40 bg-beige hover:bg-l_orange dark:bg-blue dark:hover:bg-sidebar_blue text-deep_red hover:text-white  dark:text-white rounded"
              >
                <Image
                  src={"/images/staff.png"}
                  alt="menu"
                  width={200}
                  height={200}
                  className="w-16 h-16 rounded"
                />
                <p className="text-sm font-semibold">Staff</p>
              </Link>
              <Link
                href={`/salon/${params.salonId}/${params.salonName}/appointment`}
                className="flex flex-col justify-center gap-2 items-center w-40 h-40 bg-beige hover:bg-l_orange dark:bg-blue dark:hover:bg-sidebar_blue text-deep_red hover:text-white  dark:text-white rounded"
              >
                <Image
                  src={"/images/booking.png"}
                  alt="menu"
                  width={200}
                  height={200}
                  className="w-16 h-16  rounded"
                />
                <p className="text-sm font-semibold">Bookings</p>
              </Link>
              <Link
                href={`/salon/${params.salonId}/${params.salonName}/gallery`}
                className="flex flex-col justify-center gap-2 items-center w-40 h-40 bg-beige hover:bg-l_orange dark:bg-blue dark:hover:bg-sidebar_blue text-deep_red hover:text-white  dark:text-white rounded"
              >
                <Image
                  src={"/images/gallery.png"}
                  alt="menu"
                  width={200}
                  height={200}
                  className="w-16 h-16  rounded"
                />
                <p className="text-sm font-semibold">Gallery</p>
              </Link>
              <Link
                href={`/salon/${params.salonId}/${params.salonName}/hours`}
                className="flex flex-col justify-center gap-2 items-center w-40 h-40 bg-beige hover:bg-l_orange dark:bg-blue dark:hover:bg-sidebar_blue text-deep_red hover:text-white  dark:text-white rounded"
              >
                <Image
                  src={"/images/opening.png"}
                  alt="menu"
                  width={200}
                  height={200}
                  className="w-16 h-16  rounded"
                />
                <p className="text-sm font-semibold">Opening Hours</p>
              </Link>
            </div>
          </div>
        ) : (
          <p>Couldn&apos;t find salon detail!</p>
        )}
      </div>
    </div>
  );
};

export default Page;
