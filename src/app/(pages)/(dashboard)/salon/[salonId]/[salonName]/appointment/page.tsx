"use client";

import { useSalonAppointment } from "@/lib/react-query/queriesAndMutations";
import { Open_Sans } from "next/font/google";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { CgArrowLeft } from "react-icons/cg";
import ResponsiveCalendar from "@/components/BookingCalendar/BookingCalendar";

const open_sans = Open_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const Page = ({
  params,
}: {
  params: { salonId: string; salonName: string };
}) => {
  const SalonName = decodeURIComponent(params.salonName);
  const { data: appointments, isLoading: isLoading } = useSalonAppointment(
    params.salonId
  );

  return (
    <div
      className={` bg-white dark:bg-secondary_dark rounded-sm p-6 flex flex-col gap-6 shadow-sm shadow-vll_gray dark:shadow-none ${open_sans.className}`}
    >
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
              {SalonName} Appointments
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="">
        {isLoading ? (
          <p>Loading Appointment List...</p>
        ) : (
          <div className="">
            <ResponsiveCalendar events={appointments} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
