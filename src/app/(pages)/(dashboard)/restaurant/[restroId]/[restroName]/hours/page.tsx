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
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Country, WorkingHours } from "@/types/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "next-auth/react";
import { Open_Sans } from "next/font/google";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { RootState } from "@/lib/store/store";
import Image from "next/image";
import { clearMenuItem } from "@/lib/store/features/menu/menuSlice";
import toast from "react-hot-toast";
import useAxiosPrivateFood from "@/hooks/useAxiosPrivateFood";
import Loader from "@/components/ui/Loader";
import axios from "axios";
import axiosFood from "@/axios/axiosFood";
import { clearCuisineItem } from "@/lib/store/features/cuisine/CuisineSlice";
import { Switch } from "@/components/ui/switch";
import BasicTimePicker from "@/components/DataSelector/DateSelector";
import dayjs, { Dayjs } from "dayjs";

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
  is_open: z.boolean().default(false),
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
  params: { restroId: string; restroName: string };
}) => {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { data: session } = useSession();
  const RestroName = decodeURIComponent(params.restroName);
  const dispatch = useAppDispatch();
  const axiosInstance = useAxiosPrivateFood();
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
  const restroName = decodeURIComponent(params.restroName);
  const [hours, setHours] = useState<WorkingHours[]>([]);

  const defaultValues = {
    Sunday: { start_time: "", end_time: "", is_open: false },
    Monday: { start_time: "", end_time: "", is_open: false },
    Tuesday: { start_time: "", end_time: "", is_open: false },
    Wednesday: { start_time: "", end_time: "", is_open: false },
    Thursday: { start_time: "", end_time: "", is_open: false },
    Friday: { start_time: "", end_time: "", is_open: false },
    Saturday: { start_time: "", end_time: "", is_open: false },
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!session) {
      console.error("Session not available. Cannot submit.");
      return;
    }
    console.log(values);

    const payload = {
      Sunday: {
        start_time: values.Sunday.start_time || "",
        end_time: values.Sunday.end_time || "",
        is_open: values.Sunday.is_open,
      },
      Monday: {
        start_time: values.Monday.start_time || "",
        end_time: values.Monday.end_time || "",
        is_open: values.Monday.is_open,
      },
      Tuesday: {
        start_time: values.Tuesday.start_time || "",
        end_time: values.Tuesday.end_time || "",
        is_open: values.Tuesday.is_open,
      },
      Wednesday: {
        start_time: values.Wednesday.start_time || "",
        end_time: values.Wednesday.end_time || "",
        is_open: values.Wednesday.is_open,
      },
      Thursday: {
        start_time: values.Thursday.start_time || "",
        end_time: values.Thursday.end_time || "",
        is_open: values.Thursday.is_open,
      },
      Friday: {
        start_time: values.Friday.start_time || "",
        end_time: values.Friday.end_time || "",
        is_open: values.Friday.is_open,
      },
      Saturday: {
        start_time: values.Saturday.start_time || "",
        end_time: values.Saturday.end_time || "",
        is_open: values.Saturday.is_open,
      },
    };

    if (hours) {
      axios
        .patch(
          `https://api.morefood.se/api/moreclub/user/restaurants/${params.restroId}/working/hours/`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
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
      axios
        .post(
          `https://api.morefood.se/api/moreclub/user/restaurants/${params.restroId}/working/hours/`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
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

  useEffect(() => {
    const fetchWorkingHours = async () => {
      try {
        const res = await axios.get(
          `https://api.morefood.se/api/moreclub/user/restaurants/${params.restroId}/working/hours/`,
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
            },
          }
        );
        console.log(res.data.data);
        setHours(res.data.data);
      } catch (error) {
        console.log("Error fetching working hours");
      }
    };

    fetchWorkingHours();
  }, [params.restroId]);

  // Update form values once hours have been fetched
  useEffect(() => {
    if (hours) {
      const sundayData = hours.find((day) => day.day_name === "Sunday");
      const mondayData = hours.find((day) => day.day_name === "Monday");
      const tuedayData = hours.find((day) => day.day_name === "Tuesday");
      const wednesdayData = hours.find((day) => day.day_name === "Wednesday");
      const thursdayData = hours.find((day) => day.day_name === "Thursday");
      const fridayData = hours.find((day) => day.day_name === "Friday");
      const saturdayData = hours.find((day) => day.day_name === "Saturday");

      console.log("Sunday Data:", sundayData);

      if (sundayData) {
        const { is_open, start_time, end_time } = sundayData;

        // Update local states
        setIsSundayOn(is_open);
        setStartTimeValue(start_time ? dayjs(start_time, "HH:mm:ss") : null);
        setEndTimeValue(end_time ? dayjs(end_time, "HH:mm:ss") : null);

        // Update form state
        form.setValue("Sunday", {
          is_open,
          start_time: start_time || "",
          end_time: end_time || "",
        });
      }

      if (mondayData) {
        const { is_open, start_time, end_time } = mondayData;

        // Update local states
        setIsMondayOn(is_open);
        setMonStartTimeValue(start_time ? dayjs(start_time, "HH:mm:ss") : null);
        setMonEndTimeValue(end_time ? dayjs(end_time, "HH:mm:ss") : null);

        // Update form state
        form.setValue("Monday", {
          is_open,
          start_time: start_time || "",
          end_time: end_time || "",
        });
      }

      if (tuedayData) {
        const { is_open, start_time, end_time } = tuedayData;

        // Update local states
        setIsTuesdayOn(is_open);
        setTueStartTimeValue(start_time ? dayjs(start_time, "HH:mm:ss") : null);
        setTueEndTimeValue(end_time ? dayjs(end_time, "HH:mm:ss") : null);

        // Update form state
        form.setValue("Tuesday", {
          is_open,
          start_time: start_time || "",
          end_time: end_time || "",
        });
      }

      if (wednesdayData) {
        const { is_open, start_time, end_time } = wednesdayData;

        // Update local states
        setIsWednesdayOn(is_open);
        setWedStartTimeValue(start_time ? dayjs(start_time, "HH:mm:ss") : null);
        setWedEndTimeValue(end_time ? dayjs(end_time, "HH:mm:ss") : null);

        // Update form state
        form.setValue("Wednesday", {
          is_open,
          start_time: start_time || "",
          end_time: end_time || "",
        });
      }

      if (thursdayData) {
        const { is_open, start_time, end_time } = thursdayData;

        // Update local states
        setIsThursdayOn(is_open);
        setThuStartTimeValue(start_time ? dayjs(start_time, "HH:mm:ss") : null);
        setThuEndTimeValue(end_time ? dayjs(end_time, "HH:mm:ss") : null);

        // Update form state
        form.setValue("Thursday", {
          is_open,
          start_time: start_time || "",
          end_time: end_time || "",
        });
      }

      if (fridayData) {
        const { is_open, start_time, end_time } = fridayData;

        // Update local states
        setIsFridayOn(is_open);
        setFriStartTimeValue(start_time ? dayjs(start_time, "HH:mm:ss") : null);
        setFriEndTimeValue(end_time ? dayjs(end_time, "HH:mm:ss") : null);

        // Update form state
        form.setValue("Friday", {
          is_open,
          start_time: start_time || "",
          end_time: end_time || "",
        });
      }

      if (saturdayData) {
        const { is_open, start_time, end_time } = saturdayData;

        // Update local states
        setIsSaturdayOn(is_open);
        setSatStartTimeValue(start_time ? dayjs(start_time, "HH:mm:ss") : null);
        setSatEndTimeValue(end_time ? dayjs(end_time, "HH:mm:ss") : null);

        // Update form state
        form.setValue("Saturday", {
          is_open,
          start_time: start_time || "",
          end_time: end_time || "",
        });
      }
    }
  }, [hours]); // Trigger only when `hours` changes

  return (
    <ScrollArea className="bg-white dark:bg-secondary_dark p-6 h-[88vh]">
      <h1
        className={`text-primary_text dark:text-secondary_text text-lg font-medium mb-4 ${open_sans.className}`}
      >
        Working Hours for {restroName}
      </h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          {/* <TimePicker onTimeChange={handleTimeChange} /> */}
          <FormField
            control={form.control}
            name="Sunday"
            render={({ field }) => (
              <FormItem>
                <div>
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
                          is_open: false,
                        });
                      } else {
                        // Set is_open to true when day is enabled
                        form.setValue("Sunday.is_open", true);
                      }
                    }}
                  />
                </div>

                {isSundayOn && (
                  <>
                    {/* Start Time Picker */}
                    <FormControl>
                      <div className="mt-2">
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
                      <div className="mt-2">
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
                  </>
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
                <div>
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
                          is_open: false,
                        });
                      } else {
                        // Set is_open to true when day is enabled
                        form.setValue("Monday.is_open", true);
                      }
                    }}
                  />
                </div>

                {isMondayOn && (
                  <>
                    {/* Start Time Picker */}
                    <FormControl>
                      <div className="mt-2">
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
                      <div className="mt-2">
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
                  </>
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
                <div>
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
                          is_open: false,
                        });
                      } else {
                        // Set is_open to true when day is enabled
                        form.setValue("Tuesday.is_open", true);
                      }
                    }}
                  />
                </div>

                {isTuesdayOn && (
                  <>
                    {/* Start Time Picker */}
                    <FormControl>
                      <div className="mt-2">
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
                      <div className="mt-2">
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
                  </>
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
                <div>
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
                          is_open: false,
                        });
                      } else {
                        // Set is_open to true when day is enabled
                        form.setValue("Wednesday.is_open", true);
                      }
                    }}
                  />
                </div>

                {isWednesdayOn && (
                  <>
                    {/* Start Time Picker */}
                    <FormControl>
                      <div className="mt-2">
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
                      <div className="mt-2">
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
                  </>
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
                <div>
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
                          is_open: false,
                        });
                      } else {
                        // Set is_open to true when day is enabled
                        form.setValue("Thursday.is_open", true);
                      }
                    }}
                  />
                </div>

                {isThursdayOn && (
                  <>
                    {/* Start Time Picker */}
                    <FormControl>
                      <div className="mt-2">
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
                      <div className="mt-2">
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
                  </>
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
                <div>
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
                          is_open: false,
                        });
                      } else {
                        // Set is_open to true when day is enabled
                        form.setValue("Friday.is_open", true);
                      }
                    }}
                  />
                </div>

                {isFridayOn && (
                  <>
                    {/* Start Time Picker */}
                    <FormControl>
                      <div className="mt-2">
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
                      <div className="mt-2">
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
                  </>
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
                <div>
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
                          is_open: false,
                        });
                      } else {
                        // Set is_open to true when day is enabled
                        form.setValue("Saturday.is_open", true);
                      }
                    }}
                  />
                </div>

                {isSaturdayOn && (
                  <>
                    {/* Start Time Picker */}
                    <FormControl>
                      <div className="mt-2">
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
                      <div className="mt-2">
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
                  </>
                )}

                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="bg-primary_text dark:bg-secondary_text hover:bg-l_orange dark:hover:bg-blue text-white h-8 mb-6 place-self-start rounded-lg"
          >
            {isSubmitting ? <Loader /> : hours ? "Update" : "Add"}
          </Button>
        </form>
      </Form>
    </ScrollArea>
  );
};

export default Page;