"use client";

import { useSalonStaffList } from "@/lib/react-query/queriesAndMutations";
import { useAppSelector } from "@/lib/store/hooks";
import { RootState } from "@/lib/store/store";
import { Open_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
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
import { SalonStaff } from "@/types/types";
import { AiOutlineDelete } from "react-icons/ai";
import { PencilLine } from "lucide-react";
import {
  clearSalonStaff,
  setSalonStaff,
} from "@/lib/store/features/salonStaff/salonStaffSlice";
import useAxiosPrivateSalon from "@/hooks/useAxiosPrivateSalon";
import DialogLoader from "@/components/ui/DialogLoader";
import toast from "react-hot-toast";

const open_sans = Open_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const Page = ({
  params,
}: {
  params: { salonId: string; salonName: string };
}) => {
  const dispatch = useDispatch();
  const axiosInstance = useAxiosPrivateSalon();
  const SalonName = decodeURIComponent(params.salonName);
  const [deletingStaff, setDeletingStaff] = useState<SalonStaff | null>(null);
  const { data: staffs, isLoading: isLoading } = useSalonStaffList(
    params.salonId
  );

  const deleteStaff = async (staff: SalonStaff, staffId: string) => {
    setDeletingStaff(staff);
    axiosInstance
      .delete(`/moreclub/users/saloons/${params.salonId}/staff/${staffId}/`)
      .then((response) => {
        console.log("Staff Deleted!", response);
        toast.success(`Staff Deleted!`, {
          duration: 5000,
          position: "top-right",
        });
      })
      .catch((error) => {
        console.log("Couldn't delete staff", error);
        toast.error(`Couldn't delete staff!`, {
          duration: 5000,
          position: "top-right",
        });
      })
      .finally(() => {
        setDeletingStaff(null);
      });
  };

  useEffect(() => {
    dispatch(clearSalonStaff());
  }, [dispatch]);

  return (
    <div
      className={` bg-white dark:bg-secondary_dark rounded-sm p-6 flex flex-col gap-6 shadow-sm shadow-vll_gray dark:shadow-none ${open_sans.className}`}
    >
      <div className="flex sm:flex-row flex-col gap-y-2 sm:justify-between">
        <Breadcrumb className="mb-4">
          <BreadcrumbList className="flex sm:gap-1">
            <BreadcrumbItem>
              <BreadcrumbLink
                href={`/salon/${params.salonId}/${params.salonName}/`}
              >
                <CgArrowLeft
                  className="text-primary_text dark:text-sidebar_blue"
                  size={25}
                />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage className="sm:text-xl text-lg font-medium text-primary_text dark:text-sidebar_blue">
                {SalonName} Staffs
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Link
          href={`/salon/${params.salonId}/${params.salonName}/staff/create`}
          className="bg-primary_text dark:bg-btn_blue text-white text-sm hover:bg-l_orange dark:hover:bg-blue py-1 px-4 rounded place-self-end"
        >
          Add Staff
        </Link>
      </div>

      <div className="flex flex-col gap-5 pl-1">
        {isLoading ? (
          <p>Loading Salon Staffs... </p>
        ) : !staffs ? (
          <p>Salon Staffs not found!</p>
        ) : staffs && staffs.length > 0 ? (
          <div className="flex flex-wrap gap-6">
            {staffs.map((staff: SalonStaff) => (
              <div
                key={staff.id}
                className="flex flex-col gap-2 pb-4 w-48 dark:bg-primary_dark bg-white rounded-md shadow-md shadow-vll_gray dark:shadow-none"
              >
                <div className="relative">
                  <Link
                    href={`/salon/${params.salonId}/${params.salonName}/staff/`}
                  >
                    <Image
                      src={staff.image || ""}
                      alt="menu icon"
                      width={100}
                      height={100}
                      className="w-48 h-32 rounded-t-md"
                    />
                  </Link>
                  <button
                    className="absolute right-0 top-0 bg-red-500 text-white hover:bg-white hover:text-red-500 p-1 rounded-tr-md rounded-bl-md "
                    onClick={() => {
                      deleteStaff(staff, staff.id);
                    }}
                  >
                    <AiOutlineDelete size="20" />
                  </button>
                </div>
                <div className="flex flex-col gap-1  px-2">
                  <div className="flex justify-between items-end">
                    <Link
                      href={`/salon/${params.salonId}/${params.salonName}/staff/`}
                      className="text-black dark:text-sidebar_blue font-medium  text-base capitalize line-clamp-1"
                    >
                      {staff.name}
                    </Link>
                    <Link
                      href={`/salon/${params.salonId}/${params.salonName}/staff/create`}
                      onClick={() => {
                        dispatch(setSalonStaff(staff));
                      }}
                    >
                      <PencilLine
                        size={20}
                        className="text-primary_text dark:text-sidebar_blue"
                      />
                    </Link>
                  </div>
                </div>
                {deletingStaff ? (
                  <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-25 flex justify-center items-center z-50">
                    <div className="bg-white sm:p-8 p-4 rounded shadow-lg lg:w-[30vw] sm:w-[50vw] w-[96vw] flex flex-col gap-2 items-center justify-center">
                      <DialogLoader />
                      <p className="text-black font-normal text-base">
                        Deleting {deletingStaff.name}...
                      </p>
                      <button
                        onClick={() => {
                          setDeletingStaff(null);
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
        ) : staffs.length <= 0 ? (
          <p>There are no staffs at the moment!</p>
        ) : (
          <p>Couldn&apos;t find salon staffs!</p>
        )}
      </div>
    </div>
  );
};

export default Page;
