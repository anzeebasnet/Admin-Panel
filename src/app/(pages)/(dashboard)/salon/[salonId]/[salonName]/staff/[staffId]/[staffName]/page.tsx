"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "next-auth/react";
import { Open_Sans } from "next/font/google";
import toast from "react-hot-toast";
import Loader from "@/components/ui/Loader";
import { Switch } from "@/components/ui/switch";
import BasicTimePicker from "@/components/DataSelector/DateSelector";
import dayjs, { Dayjs } from "dayjs";
import {
  useSalonStaffAppointment,
  useStaffWorkingHours,
} from "@/lib/react-query/queriesAndMutations";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { CgArrowLeft } from "react-icons/cg";
import useAxiosPrivateSalon from "@/hooks/useAxiosPrivateSalon";
import { StaffWorkingDays } from "@/types/types";
import { CiEdit } from "react-icons/ci";
import ResponsiveCalendar from "@/components/BookingCalendar/BookingCalendar";

const daySchema = z.object({
  start_time: z
    .string()
    .regex(/^\d{2}:\d{2}:\d{2}$/, "Invalid time format")
    .or(z.literal("")) // Allow empty string
    .nullable(),
  end_time: z
    .string()
    .regex(/^\d{2}:\d{2}:\d{2}$/, "Invalid time format")
    .or(z.literal("")) // Allow empty string
    .nullable(),
  is_working: z.boolean().default(false),
});

const formSchema = z.object({
  Sunday: daySchema,
  Monday: daySchema,
  Tuesday: daySchema,
  Wednesday: daySchema,
  Thursday: daySchema,
  Friday: daySchema,
  Saturday: daySchema,
});

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
    staffId: string;
    staffName: string;
  };
}) => {
  dayjs.extend(customParseFormat);
  const { data: session } = useSession();
  const axiosInstance = useAxiosPrivateSalon();
  const staffName = decodeURIComponent(params.staffName);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSundayOn, setIsSundayOn] = useState<boolean>(false);
  const [isMondayOn, setIsMondayOn] = useState<boolean>(false);
  const [isTuesdayOn, setIsTuesdayOn] = useState<boolean>(false);
  const [isWednesdayOn, setIsWednesdayOn] = useState<boolean>(false);
  const [isThursdayOn, setIsThursdayOn] = useState<boolean>(false);
  const [isFridayOn, setIsFridayOn] = useState<boolean>(false);
  const [isSaturdayOn, setIsSaturdayOn] = useState<boolean>(false);

  const [startTimeValue, setStartTimeValue] = useState<Dayjs | null>(null);
  const [endTimeValue, setEndTimeValue] = useState<Dayjs | null>(null);
  const [monstartTimeValue, setMonStartTimeValue] = useState<Dayjs | null>(
    null
  );
  const [monendTimeValue, setMonEndTimeValue] = useState<Dayjs | null>(null);
  const [tuestartTimeValue, setTueStartTimeValue] = useState<Dayjs | null>(
    null
  );
  const [tueendTimeValue, setTueEndTimeValue] = useState<Dayjs | null>(null);
  const [wedstartTimeValue, setWedStartTimeValue] = useState<Dayjs | null>(
    null
  );
  const [wedendTimeValue, setWedEndTimeValue] = useState<Dayjs | null>(null);
  const [thustartTimeValue, setThuStartTimeValue] = useState<Dayjs | null>(
    null
  );
  const [thuendTimeValue, setThuEndTimeValue] = useState<Dayjs | null>(null);
  const [fristartTimeValue, setFriStartTimeValue] = useState<Dayjs | null>(
    null
  );
  const [friendTimeValue, setFriEndTimeValue] = useState<Dayjs | null>(null);
  const [satstartTimeValue, setSatStartTimeValue] = useState<Dayjs | null>(
    null
  );
  const [satendTimeValue, setSatEndTimeValue] = useState<Dayjs | null>(null);
  const salonName = decodeURIComponent(params.salonName);
  const { data: hours, isLoading: isLoading } = useStaffWorkingHours(
    params.salonId,
    params.staffId
  );
  const { data: appointment, isLoading: isloading } = useSalonStaffAppointment(
    params.salonId,
    params.staffId
  );

  const defaultValues = {
    Sunday: { start_time: "", end_time: "", is_working: false },
    Monday: { start_time: "", end_time: "", is_working: false },
    Tuesday: { start_time: "", end_time: "", is_working: false },
    Wednesday: { start_time: "", end_time: "", is_working: false },
    Thursday: { start_time: "", end_time: "", is_working: false },
    Friday: { start_time: "", end_time: "", is_working: false },
    Saturday: { start_time: "", end_time: "", is_working: false },
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Update form values once hours have been fetched
  useEffect(() => {
    if (hours) {
      const sundayData = hours.find(
        (day: StaffWorkingDays) => day.day_of_week === "Sunday"
      );
      const mondayData = hours.find(
        (day: StaffWorkingDays) => day.day_of_week === "Monday"
      );
      const tuesdayData = hours.find(
        (day: StaffWorkingDays) => day.day_of_week === "Tuesday"
      );
      const wednesdayData = hours.find(
        (day: StaffWorkingDays) => day.day_of_week === "Wednesday"
      );
      const thursdayData = hours.find(
        (day: StaffWorkingDays) => day.day_of_week === "Thursday"
      );
      const fridayData = hours.find(
        (day: StaffWorkingDays) => day.day_of_week === "Friday"
      );
      const saturdayData = hours.find(
        (day: StaffWorkingDays) => day.day_of_week === "Saturday"
      );

      // console.log("Sunday Data:", sundayData);
      // const startTime = dayjs(sundayData.start_time.trim(), "HH:mm:ss", true);
      // console.log(
      //   "Parsed Start Time:",
      //   startTime.format("HH:mm:ss"),
      //   startTime.isValid()
      // );

      if (sundayData) {
        const { is_working, start_time, end_time } = sundayData;

        // Update local states
        setIsSundayOn(is_working);
        setStartTimeValue(start_time ? dayjs(start_time, "HH:mm:ss") : null);
        setEndTimeValue(end_time ? dayjs(end_time, "HH:mm:ss") : null);

        // Update form state
        form.setValue("Sunday", {
          is_working,
          start_time: start_time || "",
          end_time: end_time || "",
        });
      }

      if (mondayData) {
        const { is_working, start_time, end_time } = mondayData;

        // Update local states
        setIsMondayOn(is_working);
        setMonStartTimeValue(start_time ? dayjs(start_time, "HH:mm:ss") : null);
        setMonEndTimeValue(end_time ? dayjs(end_time, "HH:mm:ss") : null);

        // Update form state
        form.setValue("Monday", {
          is_working,
          start_time: start_time || "",
          end_time: end_time || "",
        });
      }

      if (tuesdayData) {
        const { is_working, start_time, end_time } = tuesdayData;

        // Update local states
        setIsTuesdayOn(is_working);
        setTueStartTimeValue(start_time ? dayjs(start_time, "HH:mm:ss") : null);
        setTueEndTimeValue(end_time ? dayjs(end_time, "HH:mm:ss") : null);

        // Update form state
        form.setValue("Tuesday", {
          is_working,
          start_time: start_time || "",
          end_time: end_time || "",
        });
      }

      if (wednesdayData) {
        const { is_working, start_time, end_time } = wednesdayData;

        // Update local states
        setIsWednesdayOn(is_working);
        setWedStartTimeValue(start_time ? dayjs(start_time, "HH:mm:ss") : null);
        setWedEndTimeValue(end_time ? dayjs(end_time, "HH:mm:ss") : null);

        // Update form state
        form.setValue("Wednesday", {
          is_working,
          start_time: start_time || "",
          end_time: end_time || "",
        });
      }

      if (thursdayData) {
        const { is_working, start_time, end_time } = thursdayData;

        // Update local states
        setIsThursdayOn(is_working);
        setThuStartTimeValue(start_time ? dayjs(start_time, "HH:mm:ss") : null);
        setThuEndTimeValue(end_time ? dayjs(end_time, "HH:mm:ss") : null);

        // Update form state
        form.setValue("Thursday", {
          is_working,
          start_time: start_time || "",
          end_time: end_time || "",
        });
      }

      if (fridayData) {
        const { is_working, start_time, end_time } = fridayData;

        // Update local states
        setIsFridayOn(is_working);
        setFriStartTimeValue(start_time ? dayjs(start_time, "HH:mm:ss") : null);
        setFriEndTimeValue(end_time ? dayjs(end_time, "HH:mm:ss") : null);

        // Update form state
        form.setValue("Friday", {
          is_working,
          start_time: start_time || "",
          end_time: end_time || "",
        });
      }

      if (saturdayData) {
        const { is_working, start_time, end_time } = saturdayData;

        // Update local states
        setIsSaturdayOn(is_working);
        setSatStartTimeValue(start_time ? dayjs(start_time, "HH:mm:ss") : null);
        setSatEndTimeValue(end_time ? dayjs(end_time, "HH:mm:ss") : null);

        // Update form state
        form.setValue("Saturday", {
          is_working,
          start_time: start_time || "",
          end_time: end_time || "",
        });
      }
    }
  }, [hours, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!session) {
      console.error("Session not available. Cannot submit.");
      return;
    }
    console.log(values);
    setIsSubmitting(true);

    const payload = {
      Sunday: {
        day_of_week: "Sunday",
        start_time: values.Sunday.start_time || "00:00:00",
        end_time: values.Sunday.end_time || "00:00:00",
        is_working: values.Sunday.is_working,
      },
      Monday: {
        day_of_week: "Monday",
        start_time: values.Monday.start_time || "00:00:00",
        end_time: values.Monday.end_time || "00:00:00",
        is_working: values.Monday.is_working,
      },
      Tuesday: {
        day_of_week: "Tuesday",
        start_time: values.Tuesday.start_time || "00:00:00",
        end_time: values.Tuesday.end_time || "00:00:00",
        is_working: values.Tuesday.is_working,
      },
      Wednesday: {
        day_of_week: "Wednesday",
        start_time: values.Wednesday.start_time || "00:00:00",
        end_time: values.Wednesday.end_time || "00:00:00",
        is_working: values.Wednesday.is_working,
      },
      Thursday: {
        day_of_week: "Thursday",
        start_time: values.Thursday.start_time || "00:00:00",
        end_time: values.Thursday.end_time || "00:00:00",
        is_working: values.Thursday.is_working,
      },
      Friday: {
        day_of_week: "Friday",
        start_time: values.Friday.start_time || "00:00:00",
        end_time: values.Friday.end_time || "00:00:00",
        is_working: values.Friday.is_working,
      },
      Saturday: {
        day_of_week: "Saturday",
        start_time: values.Saturday.start_time || "00:00:00",
        end_time: values.Saturday.end_time || "00:00:00",
        is_working: values.Saturday.is_working,
      },
    };

    if (hours?.length > 0) {
      axiosInstance
        .patch(
          `/moreclub/users/saloons/${params.salonId}/staff/${params.staffId}/working-days/detail/`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          // dispatch(setWorkingHours(formValues));
          console.log("Working hours updated successfully.", response.data);
          form.reset();
          toast.success("Working Hours updated successfully!", {
            duration: 5000,
            position: "top-right",
          });
        })
        .catch((error) => {
          console.log("Error updating working hours!", error);
          toast.error("Error updating Working Hours!");
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    } else {
      axiosInstance
        .post(
          `/moreclub/users/saloons/${params.salonId}/staff/${params.staffId}/working-days/`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          // dispatch(setWorkingHours(formValues));
          console.log("Working hours created successfully.", response.data);
          form.reset();
          toast.success("Working Hours created successfully!", {
            duration: 5000,
            position: "top-right",
          });
        })
        .catch((error) => {
          console.log("Error creating working hours!", error);
          toast.error("Error Creating Working Hours!");
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  }

  const Days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return (
    <ScrollArea className="bg-white dark:bg-secondary_dark p-6 h-[88vh]">
      <Breadcrumb className="mb-4 -ml-1">
        <BreadcrumbList className="flex sm:gap-1">
          <BreadcrumbItem>
            <BreadcrumbLink
              href={`/salon/${params.salonId}/${params.salonName}/staff`}
            >
              <CgArrowLeft
                className="text-primary_text dark:text-sidebar_blue"
                size={25}
              />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbPage className="sm:text-xl text-sm font-medium text-primary_text dark:text-sidebar_blue">
              {salonName} Staff
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex flex-col sm:gap-4 gap-2">
        <h2 className="text-lg font-medium text-primary_text dark:text-sidebar_blue">
          {staffName}
        </h2>

        <ResponsiveCalendar events={appointment} />

        {isLoading ? (
          <p>Loading Working Hours...</p>
        ) : hours && hours.length > 0 ? (
          isEditing ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-2 md:w-[65vw] w-full md:p-6 p-2 rounded-sm bg-white_smoke dark:bg-primary_dark shadow-md shadow-vll_gray dark:shadow-none"
              >
                <h2 className="text-lg font-medium text-primary_text dark:text-sidebar_blue">
                  Edit Working Time
                </h2>
                <div className="xl:grid xl:grid-cols-2 xl:gap-8 gap-4 flex flex-wrap justify-between mt-4 ">
                  <FormField
                    control={form.control}
                    name="Sunday"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormLabel>Sunday</FormLabel>
                          <Switch
                            checked={isSundayOn}
                            onCheckedChange={(checked) => {
                              setIsSundayOn(checked);
                              if (!checked) {
                                // Reset time values when day is closed
                                setStartTimeValue(null);
                                setEndTimeValue(null);
                                form.setValue("Sunday", {
                                  start_time: "",
                                  end_time: "",
                                  is_working: false,
                                });
                              } else {
                                // Set is_working to true when day is enabled
                                form.setValue("Sunday.is_working", true);
                              }
                            }}
                          />
                          {!isSundayOn ? (
                            <p className="text-sm font-medium text-gray-600">
                              Day Off
                            </p>
                          ) : (
                            ""
                          )}
                        </div>
                        {isSundayOn && (
                          <div className="flex sm:flex-row flex-col sm:gap-4 gap-0">
                            {/* Start Time Picker */}
                            <FormControl>
                              <div className="">
                                <FormLabel>Start Time</FormLabel>
                                <BasicTimePicker
                                  value={startTimeValue}
                                  onChange={(newValue: Dayjs | null) => {
                                    setStartTimeValue(newValue);
                                    form.setValue(
                                      "Sunday.start_time",
                                      newValue
                                        ? newValue.format("HH:mm:ss")
                                        : ""
                                    );
                                  }}
                                />
                              </div>
                            </FormControl>
                            {/* End Time Picker */}
                            <FormControl>
                              <div className="">
                                <FormLabel>End Time</FormLabel>
                                <BasicTimePicker
                                  value={endTimeValue}
                                  onChange={(newValue: Dayjs | null) => {
                                    setEndTimeValue(newValue);
                                    form.setValue(
                                      "Sunday.end_time",
                                      newValue
                                        ? newValue.format("HH:mm:ss")
                                        : ""
                                    );
                                  }}
                                />
                              </div>
                            </FormControl>
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="Monday"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormLabel>Monday</FormLabel>
                          <Switch
                            checked={isMondayOn}
                            onCheckedChange={(checked) => {
                              setIsMondayOn(checked);
                              if (!checked) {
                                // Reset time values when day is closed
                                form.setValue("Monday", {
                                  start_time: "",
                                  end_time: "",
                                  is_working: false,
                                });
                              } else {
                                // Set is_working to true when day is enabled
                                form.setValue("Monday.is_working", true);
                              }
                            }}
                          />
                          {!isMondayOn ? (
                            <p className="text-sm font-medium text-gray-600">
                              Day Off
                            </p>
                          ) : (
                            ""
                          )}
                        </div>
                        {isMondayOn && (
                          <div className="flex sm:flex-row flex-col sm:gap-4 gap-0">
                            {/* Start Time Picker */}
                            <FormControl>
                              <div className="">
                                <FormLabel>Start Time</FormLabel>
                                <BasicTimePicker
                                  value={monstartTimeValue}
                                  onChange={(newValue: Dayjs | null) => {
                                    setMonStartTimeValue(newValue);
                                    form.setValue(
                                      "Monday.start_time",
                                      newValue
                                        ? newValue.format("HH:mm:ss")
                                        : ""
                                    );
                                  }}
                                />
                              </div>
                            </FormControl>
                            {/* End Time Picker */}
                            <FormControl>
                              <div className="">
                                <FormLabel>End Time</FormLabel>
                                <BasicTimePicker
                                  value={monendTimeValue}
                                  onChange={(newValue: Dayjs | null) => {
                                    setMonEndTimeValue(newValue);
                                    form.setValue(
                                      "Monday.end_time",
                                      newValue
                                        ? newValue.format("HH:mm:ss")
                                        : ""
                                    );
                                  }}
                                />
                              </div>
                            </FormControl>
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="Tuesday"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormLabel>Tuesday</FormLabel>
                          <Switch
                            checked={isTuesdayOn}
                            onCheckedChange={(checked) => {
                              setIsTuesdayOn(checked);
                              if (!checked) {
                                // Reset time values when day is closed
                                form.setValue("Tuesday", {
                                  start_time: "",
                                  end_time: "",
                                  is_working: false,
                                });
                              } else {
                                // Set is_working to true when day is enabled
                                form.setValue("Tuesday.is_working", true);
                              }
                            }}
                          />
                          {!isTuesdayOn ? (
                            <p className="text-sm font-medium text-gray-600">
                              Day Off
                            </p>
                          ) : (
                            ""
                          )}
                        </div>
                        {isTuesdayOn && (
                          <div className="flex sm:flex-row flex-col sm:gap-4 gap-0">
                            {/* Start Time Picker */}
                            <FormControl>
                              <div className="">
                                <FormLabel>Start Time</FormLabel>
                                <BasicTimePicker
                                  value={tuestartTimeValue}
                                  onChange={(newValue: Dayjs | null) => {
                                    setTueStartTimeValue(newValue);
                                    form.setValue(
                                      "Tuesday.start_time",
                                      newValue
                                        ? newValue.format("HH:mm:ss")
                                        : ""
                                    );
                                  }}
                                />
                              </div>
                            </FormControl>
                            {/* End Time Picker */}
                            <FormControl>
                              <div className="">
                                <FormLabel>End Time</FormLabel>
                                <BasicTimePicker
                                  value={tueendTimeValue}
                                  onChange={(newValue: Dayjs | null) => {
                                    setTueEndTimeValue(newValue);
                                    form.setValue(
                                      "Tuesday.end_time",
                                      newValue
                                        ? newValue.format("HH:mm:ss")
                                        : ""
                                    );
                                  }}
                                />
                              </div>
                            </FormControl>
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="Wednesday"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormLabel>Wednesday</FormLabel>
                          <Switch
                            checked={isWednesdayOn}
                            onCheckedChange={(checked) => {
                              setIsWednesdayOn(checked);
                              if (!checked) {
                                // Reset time values when day is closed
                                form.setValue("Wednesday", {
                                  start_time: "",
                                  end_time: "",
                                  is_working: false,
                                });
                              } else {
                                // Set is_working to true when day is enabled
                                form.setValue("Wednesday.is_working", true);
                              }
                            }}
                          />
                          {!isWednesdayOn ? (
                            <p className="text-sm font-medium text-gray-600">
                              Day Off
                            </p>
                          ) : (
                            ""
                          )}
                        </div>
                        {isWednesdayOn && (
                          <div className="flex sm:flex-row flex-col sm:gap-4 gap-0">
                            {/* Start Time Picker */}
                            <FormControl>
                              <div className="">
                                <FormLabel>Start Time</FormLabel>
                                <BasicTimePicker
                                  value={wedstartTimeValue}
                                  onChange={(newValue: Dayjs | null) => {
                                    setWedStartTimeValue(newValue);
                                    form.setValue(
                                      "Wednesday.start_time",
                                      newValue
                                        ? newValue.format("HH:mm:ss")
                                        : ""
                                    );
                                  }}
                                />
                              </div>
                            </FormControl>
                            {/* End Time Picker */}
                            <FormControl>
                              <div className="">
                                <FormLabel>End Time</FormLabel>
                                <BasicTimePicker
                                  value={wedendTimeValue}
                                  onChange={(newValue: Dayjs | null) => {
                                    setWedEndTimeValue(newValue);
                                    form.setValue(
                                      "Wednesday.end_time",
                                      newValue
                                        ? newValue.format("HH:mm:ss")
                                        : ""
                                    );
                                  }}
                                />
                              </div>
                            </FormControl>
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="Thursday"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormLabel>Thursday</FormLabel>
                          <Switch
                            checked={isThursdayOn}
                            onCheckedChange={(checked) => {
                              setIsThursdayOn(checked);
                              if (!checked) {
                                // Reset time values when day is closed
                                form.setValue("Thursday", {
                                  start_time: "",
                                  end_time: "",
                                  is_working: false,
                                });
                              } else {
                                // Set is_working to true when day is enabled
                                form.setValue("Thursday.is_working", true);
                              }
                            }}
                          />
                          {!isThursdayOn ? (
                            <p className="text-sm font-medium text-gray-600">
                              Day Off
                            </p>
                          ) : (
                            ""
                          )}
                        </div>
                        {isThursdayOn && (
                          <div className="flex sm:flex-row flex-col sm:gap-4 gap-0">
                            {/* Start Time Picker */}
                            <FormControl>
                              <div className="">
                                <FormLabel>Start Time</FormLabel>
                                <BasicTimePicker
                                  value={thustartTimeValue}
                                  onChange={(newValue: Dayjs | null) => {
                                    setThuStartTimeValue(newValue);
                                    form.setValue(
                                      "Thursday.start_time",
                                      newValue
                                        ? newValue.format("HH:mm:ss")
                                        : ""
                                    );
                                  }}
                                />
                              </div>
                            </FormControl>
                            {/* End Time Picker */}
                            <FormControl>
                              <div className="">
                                <FormLabel>End Time</FormLabel>
                                <BasicTimePicker
                                  value={thuendTimeValue}
                                  onChange={(newValue: Dayjs | null) => {
                                    setThuEndTimeValue(newValue);
                                    form.setValue(
                                      "Thursday.end_time",
                                      newValue
                                        ? newValue.format("HH:mm:ss")
                                        : ""
                                    );
                                  }}
                                />
                              </div>
                            </FormControl>
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="Friday"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormLabel>Friday</FormLabel>
                          <Switch
                            checked={isFridayOn}
                            onCheckedChange={(checked) => {
                              setIsFridayOn(checked);
                              if (!checked) {
                                // Reset time values when day is closed
                                form.setValue("Friday", {
                                  start_time: "",
                                  end_time: "",
                                  is_working: false,
                                });
                              } else {
                                // Set is_working to true when day is enabled
                                form.setValue("Friday.is_working", true);
                              }
                            }}
                          />
                          {!isFridayOn ? (
                            <p className="text-sm font-medium text-gray-600">
                              Day Off
                            </p>
                          ) : (
                            ""
                          )}
                        </div>
                        {isFridayOn && (
                          <div className="flex sm:flex-row flex-col sm:gap-4 gap-0">
                            {/* Start Time Picker */}
                            <FormControl>
                              <div className="">
                                <FormLabel>Start Time</FormLabel>
                                <BasicTimePicker
                                  value={fristartTimeValue}
                                  onChange={(newValue: Dayjs | null) => {
                                    setFriStartTimeValue(newValue);
                                    form.setValue(
                                      "Friday.start_time",
                                      newValue
                                        ? newValue.format("HH:mm:ss")
                                        : ""
                                    );
                                  }}
                                />
                              </div>
                            </FormControl>
                            {/* End Time Picker */}
                            <FormControl>
                              <div className="">
                                <FormLabel>End Time</FormLabel>
                                <BasicTimePicker
                                  value={friendTimeValue}
                                  onChange={(newValue: Dayjs | null) => {
                                    setFriEndTimeValue(newValue);
                                    form.setValue(
                                      "Friday.end_time",
                                      newValue
                                        ? newValue.format("HH:mm:ss")
                                        : ""
                                    );
                                  }}
                                />
                              </div>
                            </FormControl>
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="Saturday"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormLabel>Saturday</FormLabel>
                          <Switch
                            checked={isSaturdayOn}
                            onCheckedChange={(checked) => {
                              setIsSaturdayOn(checked);
                              if (!checked) {
                                // Reset time values when day is closed
                                form.setValue("Saturday", {
                                  start_time: "",
                                  end_time: "",
                                  is_working: false,
                                });
                              } else {
                                // Set is_working to true when day is enabled
                                form.setValue("Saturday.is_working", true);
                              }
                            }}
                          />
                          {!isSaturdayOn ? (
                            <p className="text-sm font-medium text-gray-600">
                              Day Off
                            </p>
                          ) : (
                            ""
                          )}
                        </div>
                        {isSaturdayOn && (
                          <div className="flex sm:flex-row flex-col sm:gap-4 gap-0">
                            {/* Start Time Picker */}
                            <FormControl>
                              <div className="">
                                <FormLabel>Start Time</FormLabel>
                                <BasicTimePicker
                                  value={satstartTimeValue}
                                  onChange={(newValue: Dayjs | null) => {
                                    setSatStartTimeValue(newValue);
                                    form.setValue(
                                      "Saturday.start_time",
                                      newValue
                                        ? newValue.format("HH:mm:ss")
                                        : ""
                                    );
                                  }}
                                />
                              </div>
                            </FormControl>
                            {/* End Time Picker */}
                            <FormControl>
                              <div className="">
                                <FormLabel>End Time</FormLabel>
                                <BasicTimePicker
                                  value={satendTimeValue}
                                  onChange={(newValue: Dayjs | null) => {
                                    setSatEndTimeValue(newValue);
                                    form.setValue(
                                      "Saturday.end_time",
                                      newValue
                                        ? newValue.format("HH:mm:ss")
                                        : ""
                                    );
                                  }}
                                />
                              </div>
                            </FormControl>
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className=" my-3 flex gap-4">
                  <button
                    type="submit"
                    className="bg-primary_text dark:bg-sidebar_blue hover:bg-l_orange dark:hover:bg-blue text-white text-sm px-4 py-1 place-self-start rounded"
                  >
                    {isSubmitting ? (
                      <Loader />
                    ) : hours?.length > 0 ? (
                      "Update"
                    ) : (
                      "Add"
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                    }}
                    className="bg-red-600 text-sm text-white px-4 py-1 place-self-start rounded"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </Form>
          ) : (
            <div
              // style={{
              //   boxShadow:
              //     "-4px -4px 6px rgba(0, 0, 0, 0.1), 4px 4px 6px rgba(0, 0, 0, 0.1)",
              // }}
              className="md:w-[40vw] p-6 w-full rounded-sm bg-white_smoke dark:bg-primary_dark shadow-md shadow-vll_gray dark:shadow-none flex flex-col gap-2"
            >
              <div className="flex justify-between gap-4">
                <h2 className="text-lg font-medium text-primary_text dark:text-sidebar_blue">
                  Working Time
                </h2>
                <button
                  className="bg-deep_red py-1 px-3 text-sm font-medium text-white rounded flex gap-1"
                  onClick={() => {
                    setIsEditing(true);
                  }}
                >
                  <CiEdit size={20} />
                  <p>Edit</p>
                </button>
              </div>
              <div className="flex flex-col gap-3 ">
                {hours.map((hour: StaffWorkingDays) => {
                  const formatTime = (time: string) => {
                    const [hours, minutes] = time.split(":");
                    const date = new Date();
                    date.setHours(Number(hours), Number(minutes));
                    return new Intl.DateTimeFormat("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    }).format(date);
                  };

                  return (
                    <div
                      key={hour.id}
                      className="grid grid-cols-2 gap-6 text-sm"
                    >
                      <p>{hour.day_of_week}</p>
                      {hour.start_time && hour.end_time ? (
                        <p>
                          {formatTime(hour.start_time)} to{" "}
                          {formatTime(hour.end_time)}
                        </p>
                      ) : (
                        <p>Day off</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )
        ) : hours?.length <= 0 ? (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4 md:w-[65vw] w-full md:p-6 p-2 rounded-sm bg-white dark:bg-primary_dark "
            >
              <div className="xl:grid xl:grid-cols-2 xl:gap-8 gap-4 flex flex-wrap justify-between mt-4 ">
                <FormField
                  control={form.control}
                  name="Sunday"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormLabel>Sunday</FormLabel>
                        <Switch
                          checked={isSundayOn}
                          onCheckedChange={(checked) => {
                            setIsSundayOn(checked);
                            if (!checked) {
                              // Reset time values when day is closed
                              setStartTimeValue(null);
                              setEndTimeValue(null);
                              form.setValue("Sunday", {
                                start_time: "",
                                end_time: "",
                                is_working: false,
                              });
                            } else {
                              // Set is_working to true when day is enabled
                              form.setValue("Sunday.is_working", true);
                            }
                          }}
                        />
                        {!isSundayOn ? (
                          <p className="text-sm font-medium text-gray-600">
                            Day Off
                          </p>
                        ) : (
                          ""
                        )}
                      </div>
                      {isSundayOn && (
                        <div className="flex sm:flex-row flex-col sm:gap-4 gap-0">
                          {/* Start Time Picker */}
                          <FormControl>
                            <div className="">
                              <FormLabel>Start Time</FormLabel>
                              <BasicTimePicker
                                value={startTimeValue}
                                onChange={(newValue: Dayjs | null) => {
                                  setStartTimeValue(newValue);
                                  form.setValue(
                                    "Sunday.start_time",
                                    newValue ? newValue.format("HH:mm:ss") : ""
                                  );
                                }}
                              />
                            </div>
                          </FormControl>
                          {/* End Time Picker */}
                          <FormControl>
                            <div className="">
                              <FormLabel>End Time</FormLabel>
                              <BasicTimePicker
                                value={endTimeValue}
                                onChange={(newValue: Dayjs | null) => {
                                  setEndTimeValue(newValue);
                                  form.setValue(
                                    "Sunday.end_time",
                                    newValue ? newValue.format("HH:mm:ss") : ""
                                  );
                                }}
                              />
                            </div>
                          </FormControl>
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="Monday"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormLabel>Monday</FormLabel>
                        <Switch
                          checked={isMondayOn}
                          onCheckedChange={(checked) => {
                            setIsMondayOn(checked);
                            if (!checked) {
                              // Reset time values when day is closed
                              form.setValue("Monday", {
                                start_time: "",
                                end_time: "",
                                is_working: false,
                              });
                            } else {
                              // Set is_working to true when day is enabled
                              form.setValue("Monday.is_working", true);
                            }
                          }}
                        />
                        {!isMondayOn ? (
                          <p className="text-sm font-medium text-gray-600">
                            Day Off
                          </p>
                        ) : (
                          ""
                        )}
                      </div>
                      {isMondayOn && (
                        <div className="flex sm:flex-row flex-col sm:gap-4 gap-0">
                          {/* Start Time Picker */}
                          <FormControl>
                            <div className="">
                              <FormLabel>Start Time</FormLabel>
                              <BasicTimePicker
                                value={monstartTimeValue}
                                onChange={(newValue: Dayjs | null) => {
                                  setMonStartTimeValue(newValue);
                                  form.setValue(
                                    "Monday.start_time",
                                    newValue ? newValue.format("HH:mm:ss") : ""
                                  );
                                }}
                              />
                            </div>
                          </FormControl>
                          {/* End Time Picker */}
                          <FormControl>
                            <div className="">
                              <FormLabel>End Time</FormLabel>
                              <BasicTimePicker
                                value={monendTimeValue}
                                onChange={(newValue: Dayjs | null) => {
                                  setMonEndTimeValue(newValue);
                                  form.setValue(
                                    "Monday.end_time",
                                    newValue ? newValue.format("HH:mm:ss") : ""
                                  );
                                }}
                              />
                            </div>
                          </FormControl>
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="Tuesday"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormLabel>Tuesday</FormLabel>
                        <Switch
                          checked={isTuesdayOn}
                          onCheckedChange={(checked) => {
                            setIsTuesdayOn(checked);
                            if (!checked) {
                              // Reset time values when day is closed
                              form.setValue("Tuesday", {
                                start_time: "",
                                end_time: "",
                                is_working: false,
                              });
                            } else {
                              // Set is_working to true when day is enabled
                              form.setValue("Tuesday.is_working", true);
                            }
                          }}
                        />
                        {!isTuesdayOn ? (
                          <p className="text-sm font-medium text-gray-600">
                            Day Off
                          </p>
                        ) : (
                          ""
                        )}
                      </div>
                      {isTuesdayOn && (
                        <div className="flex sm:flex-row flex-col sm:gap-4 gap-0">
                          {/* Start Time Picker */}
                          <FormControl>
                            <div className="">
                              <FormLabel>Start Time</FormLabel>
                              <BasicTimePicker
                                value={tuestartTimeValue}
                                onChange={(newValue: Dayjs | null) => {
                                  setTueStartTimeValue(newValue);
                                  form.setValue(
                                    "Tuesday.start_time",
                                    newValue ? newValue.format("HH:mm:ss") : ""
                                  );
                                }}
                              />
                            </div>
                          </FormControl>
                          {/* End Time Picker */}
                          <FormControl>
                            <div className="">
                              <FormLabel>End Time</FormLabel>
                              <BasicTimePicker
                                value={tueendTimeValue}
                                onChange={(newValue: Dayjs | null) => {
                                  setTueEndTimeValue(newValue);
                                  form.setValue(
                                    "Tuesday.end_time",
                                    newValue ? newValue.format("HH:mm:ss") : ""
                                  );
                                }}
                              />
                            </div>
                          </FormControl>
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="Wednesday"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormLabel>Wednesday</FormLabel>
                        <Switch
                          checked={isWednesdayOn}
                          onCheckedChange={(checked) => {
                            setIsWednesdayOn(checked);
                            if (!checked) {
                              // Reset time values when day is closed
                              form.setValue("Wednesday", {
                                start_time: "",
                                end_time: "",
                                is_working: false,
                              });
                            } else {
                              // Set is_working to true when day is enabled
                              form.setValue("Wednesday.is_working", true);
                            }
                          }}
                        />
                        {!isWednesdayOn ? (
                          <p className="text-sm font-medium text-gray-600">
                            Day Off
                          </p>
                        ) : (
                          ""
                        )}
                      </div>
                      {isWednesdayOn && (
                        <div className="flex sm:flex-row flex-col sm:gap-4 gap-0">
                          {/* Start Time Picker */}
                          <FormControl>
                            <div className="">
                              <FormLabel>Start Time</FormLabel>
                              <BasicTimePicker
                                value={wedstartTimeValue}
                                onChange={(newValue: Dayjs | null) => {
                                  setWedStartTimeValue(newValue);
                                  form.setValue(
                                    "Wednesday.start_time",
                                    newValue ? newValue.format("HH:mm:ss") : ""
                                  );
                                }}
                              />
                            </div>
                          </FormControl>
                          {/* End Time Picker */}
                          <FormControl>
                            <div className="">
                              <FormLabel>End Time</FormLabel>
                              <BasicTimePicker
                                value={wedendTimeValue}
                                onChange={(newValue: Dayjs | null) => {
                                  setWedEndTimeValue(newValue);
                                  form.setValue(
                                    "Wednesday.end_time",
                                    newValue ? newValue.format("HH:mm:ss") : ""
                                  );
                                }}
                              />
                            </div>
                          </FormControl>
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="Thursday"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormLabel>Thursday</FormLabel>
                        <Switch
                          checked={isThursdayOn}
                          onCheckedChange={(checked) => {
                            setIsThursdayOn(checked);
                            if (!checked) {
                              // Reset time values when day is closed
                              form.setValue("Thursday", {
                                start_time: "",
                                end_time: "",
                                is_working: false,
                              });
                            } else {
                              // Set is_working to true when day is enabled
                              form.setValue("Thursday.is_working", true);
                            }
                          }}
                        />
                        {!isThursdayOn ? (
                          <p className="text-sm font-medium text-gray-600">
                            Day Off
                          </p>
                        ) : (
                          ""
                        )}
                      </div>
                      {isThursdayOn && (
                        <div className="flex sm:flex-row flex-col sm:gap-4 gap-0">
                          {/* Start Time Picker */}
                          <FormControl>
                            <div className="">
                              <FormLabel>Start Time</FormLabel>
                              <BasicTimePicker
                                value={thustartTimeValue}
                                onChange={(newValue: Dayjs | null) => {
                                  setThuStartTimeValue(newValue);
                                  form.setValue(
                                    "Thursday.start_time",
                                    newValue ? newValue.format("HH:mm:ss") : ""
                                  );
                                }}
                              />
                            </div>
                          </FormControl>
                          {/* End Time Picker */}
                          <FormControl>
                            <div className="">
                              <FormLabel>End Time</FormLabel>
                              <BasicTimePicker
                                value={thuendTimeValue}
                                onChange={(newValue: Dayjs | null) => {
                                  setThuEndTimeValue(newValue);
                                  form.setValue(
                                    "Thursday.end_time",
                                    newValue ? newValue.format("HH:mm:ss") : ""
                                  );
                                }}
                              />
                            </div>
                          </FormControl>
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="Friday"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormLabel>Friday</FormLabel>
                        <Switch
                          checked={isFridayOn}
                          onCheckedChange={(checked) => {
                            setIsFridayOn(checked);
                            if (!checked) {
                              // Reset time values when day is closed
                              form.setValue("Friday", {
                                start_time: "",
                                end_time: "",
                                is_working: false,
                              });
                            } else {
                              // Set is_working to true when day is enabled
                              form.setValue("Friday.is_working", true);
                            }
                          }}
                        />
                        {!isFridayOn ? (
                          <p className="text-sm font-medium text-gray-600">
                            Day Off
                          </p>
                        ) : (
                          ""
                        )}
                      </div>
                      {isFridayOn && (
                        <div className="flex sm:flex-row flex-col sm:gap-4 gap-0">
                          {/* Start Time Picker */}
                          <FormControl>
                            <div className="">
                              <FormLabel>Start Time</FormLabel>
                              <BasicTimePicker
                                value={fristartTimeValue}
                                onChange={(newValue: Dayjs | null) => {
                                  setFriStartTimeValue(newValue);
                                  form.setValue(
                                    "Friday.start_time",
                                    newValue ? newValue.format("HH:mm:ss") : ""
                                  );
                                }}
                              />
                            </div>
                          </FormControl>
                          {/* End Time Picker */}
                          <FormControl>
                            <div className="">
                              <FormLabel>End Time</FormLabel>
                              <BasicTimePicker
                                value={friendTimeValue}
                                onChange={(newValue: Dayjs | null) => {
                                  setFriEndTimeValue(newValue);
                                  form.setValue(
                                    "Friday.end_time",
                                    newValue ? newValue.format("HH:mm:ss") : ""
                                  );
                                }}
                              />
                            </div>
                          </FormControl>
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="Saturday"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormLabel>Saturday</FormLabel>
                        <Switch
                          checked={isSaturdayOn}
                          onCheckedChange={(checked) => {
                            setIsSaturdayOn(checked);
                            if (!checked) {
                              // Reset time values when day is closed
                              form.setValue("Saturday", {
                                start_time: "",
                                end_time: "",
                                is_working: false,
                              });
                            } else {
                              // Set is_working to true when day is enabled
                              form.setValue("Saturday.is_working", true);
                            }
                          }}
                        />
                        {!isSaturdayOn ? (
                          <p className="text-sm font-medium text-gray-600">
                            Day Off
                          </p>
                        ) : (
                          ""
                        )}
                      </div>
                      {isSaturdayOn && (
                        <div className="flex sm:flex-row flex-col sm:gap-4 gap-0">
                          {/* Start Time Picker */}
                          <FormControl>
                            <div className="">
                              <FormLabel>Start Time</FormLabel>
                              <BasicTimePicker
                                value={satstartTimeValue}
                                onChange={(newValue: Dayjs | null) => {
                                  setSatStartTimeValue(newValue);
                                  form.setValue(
                                    "Saturday.start_time",
                                    newValue ? newValue.format("HH:mm:ss") : ""
                                  );
                                }}
                              />
                            </div>
                          </FormControl>
                          {/* End Time Picker */}
                          <FormControl>
                            <div className="">
                              <FormLabel>End Time</FormLabel>
                              <BasicTimePicker
                                value={satendTimeValue}
                                onChange={(newValue: Dayjs | null) => {
                                  setSatEndTimeValue(newValue);
                                  form.setValue(
                                    "Saturday.end_time",
                                    newValue ? newValue.format("HH:mm:ss") : ""
                                  );
                                }}
                              />
                            </div>
                          </FormControl>
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="bg-primary_text dark:bg-sidebar_blue hover:bg-l_orange dark:hover:bg-blue text-white h-8 mb-6 place-self-start rounded-lg"
              >
                {isSubmitting ? (
                  <Loader />
                ) : hours?.length > 0 ? (
                  "Update"
                ) : (
                  "Add"
                )}
              </Button>
            </form>
          </Form>
        ) : (
          <p>Couldn&apos;t load working hours for staff</p>
        )}
      </div>
    </ScrollArea>
  );
};

export default Page;
