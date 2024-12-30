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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "next-auth/react";
import { Open_Sans } from "next/font/google";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { RootState } from "@/lib/store/store";
import Image from "next/image";
import useAxiosPrivateFood from "@/hooks/useAxiosPrivateFood";
import Loader from "@/components/ui/Loader";
import { Textarea } from "@/components/ui/textarea";
import {
  Cuisine,
  FoodItemType,
  RestroFoodItem,
  RestroMenuList,
} from "@/types/types";
import {
  useRestroItemList,
  useRestroMenuList,
} from "@/lib/react-query/queriesAndMutations";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import CSS for DatePicker styling
import toast from "react-hot-toast";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CgArrowLeft } from "react-icons/cg";
import { RxCross2 } from "react-icons/rx";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  addDays,
  startOfWeek,
  setHours,
  setMinutes,
  setSeconds,
} from "date-fns";

const dayTimeSchema = z.object({
  start_time: z.string().min(1, "Start time is required.").optional(),
  end_time: z.string().min(1, "End time is required.").optional(),
});

const formSchema = z
  .object({
    name: z.string().min(2, {
      message: "Name can't be empty.",
    }),
    banner: z.instanceof(File).optional(),
    price: z.string(),
    description: z.string().min(6, {
      message: "Short Description must be at least 6 characters.",
    }),
    start_offer: z
      .string()
      .optional()
      .refine(
        (val) => !val || !isNaN(new Date(val).getTime()),
        "Start Offer must be a valid date and time."
      ),
    end_offer: z
      .string()
      .optional()
      .refine(
        (val) => !val || !isNaN(new Date(val).getTime()),
        "End Offer must be a valid date and time."
      ),
    food_item_ids: z.array(z.string()).refine((val) => val.length > 0, {
      message: "Please select at least one food item.",
    }),
    menu_id: z.string(),
    is_everyday: z.boolean(),
    monday: dayTimeSchema.optional(),
    tuesday: dayTimeSchema.optional(),
    wednesday: dayTimeSchema.optional(),
    thursday: dayTimeSchema.optional(),
    friday: dayTimeSchema.optional(),
    saturday: dayTimeSchema.optional(),
    sunday: dayTimeSchema.optional(),
  })
  .superRefine((data, ctx) => {
    // If `is_everyday` is true, validate `start_offer` and `end_offer`
    if (data.is_everyday) {
      if (!data.start_offer) {
        ctx.addIssue({
          code: "custom",
          path: ["start_offer"],
          message: "Start Offer is required when Is Every Day is true.",
        });
      }
      if (!data.end_offer) {
        ctx.addIssue({
          code: "custom",
          path: ["end_offer"],
          message: "End Offer is required when Is Every Day is true.",
        });
      }
    }

    // If `is_everyday` is false, ensure `applicable_days` has at least one valid day
    if (!data.is_everyday) {
      const hasValidDays =
        data.monday?.start_time ||
        data.tuesday?.start_time ||
        data.wednesday?.start_time ||
        data.thursday?.start_time ||
        data.friday?.start_time ||
        data.saturday?.start_time ||
        data.sunday?.start_time;

      if (!hasValidDays) {
        ctx.addIssue({
          code: "custom",
          path: ["applicable_days"],
          message:
            "At least one day with valid start and end times is required when Is Every Day is false.",
        });
      }
    }
  });

const open_sans = Open_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const Page = ({
  params,
}: {
  params: {
    restroId: string;
    restroName: string;
  };
}) => {
  const { data: session } = useSession();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [categories, setCategories] = useState<RestroMenuList[]>([]); // Categories data
  const [foodItems, setFoodItems] = useState<FoodItemType[]>([]); // Food items based on the selected category
  const [selectedCategoryId, setSelectedCategoryId] = useState(""); // Selected category ID
  const [selectedFoodItems, setSelectedFoodItems] = useState<RestroFoodItem[]>(
    []
  );
  const [isSpecificDay, setIsSpecificDay] = useState<boolean>(false);
  const [isEveryDay, setIsEveryDay] = useState<boolean>(true);

  const { data: restroMenuList } = useRestroMenuList(params.restroId);
  const axiosInstance = useAxiosPrivateFood();
  const OfferData = useAppSelector((state) => state.offer.currentOffer);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      banner: undefined,
      price: "",
      description: "",
      start_offer: "",
      end_offer: "",
      food_item_ids: [],
      menu_id: "",
      is_everyday: isEveryDay,
    },
  });

  const getNextDayWithTime = (desiredDay: any, time: any) => {
    const now = new Date();
    const currentDay = now.getDay();
    const daysUntilNextDay = (desiredDay - currentDay + 7) % 7 || 7; // Days until the next desired day

    // Calculate the next desired day
    const upcomingDay = addDays(now, daysUntilNextDay);

    // Combine the desired time with the calculated day
    const nextDayWithTime = setHours(
      setMinutes(setSeconds(upcomingDay, time.getSeconds()), time.getMinutes()),
      time.getHours()
    );

    return nextDayWithTime;
  };

  useEffect(() => {
    if (restroMenuList) {
      setCategories(restroMenuList);
    }
  }, [restroMenuList]);

  useEffect(() => {
    async function fetchFoodItems() {
      if (!selectedCategoryId) return;

      const res = await axiosInstance.get(
        `/moreclub/user/food/items/${selectedCategoryId}/${params.restroId}/`
      );
      const data = res.data.data;
      setFoodItems(data);
    }
    fetchFoodItems();
  }, [selectedCategoryId]);

  useEffect(() => {
    async function fetchAllFoodItems() {
      const promises = categories.map(async (category) => {
        const res = await axiosInstance.get(
          `/moreclub/user/food/items/${category.id}/${params.restroId}/`
        );
        return res.data.data;
      });

      // Await all promises and flatten the resulting arrays
      const allFoodItems = (await Promise.all(promises)).flat();
      setFoodItems(allFoodItems);

      // Pre-select the food items based on OfferData
      if (OfferData?.food_item) {
        const foodIds = OfferData.food_item.map((item) => item.id);
        const selectedItems = allFoodItems.filter((item) =>
          foodIds.includes(item.id)
        );
        setSelectedFoodItems(selectedItems);
        form.setValue(
          "food_item_ids",
          selectedItems.map((item) => item.id)
        );
      }
    }

    if (OfferData && categories.length > 0) {
      fetchAllFoodItems();
    }

    if (OfferData) {
      form.setValue("name", OfferData.name);
      form.setValue("price", OfferData.price.toString());
      form.setValue("description", OfferData.description);
      form.setValue("is_everyday", OfferData.is_every_day);
      form.setValue("start_offer", OfferData.start_offer || "");
      form.setValue("end_offer", OfferData.end_offer || "");

      // // Set services as an array of service IDs
      // if (OfferData.food_item) {
      //   const foodIds = OfferData.food_item.map((item) => item.id);
      //   form.setValue("food_item_ids", foodIds);
      // }

      if (!OfferData.is_every_day) {
        setIsSpecificDay(true);
        setIsEveryDay(false);
      }

      if (OfferData.banner) {
        setImagePreview(OfferData.banner);
      }

      if (OfferData.applicable_days) {
        const applicableDays = OfferData.applicable_days;
        const convertToUTC = (time: string) => {
          const localDate = new Date(time); // Parse local time
          return localDate.toISOString(); // Convert to UTC and return in ISO format
        };
        if (applicableDays.Monday) {
          form.setValue(
            "monday.start_time",
            convertToUTC(applicableDays.Monday?.start_time)
          );
          form.setValue(
            "monday.end_time",
            convertToUTC(applicableDays.Monday?.end_time)
          );
        }
        if (applicableDays.Tuesday) {
          form.setValue(
            "tuesday.start_time",
            convertToUTC(applicableDays.Tuesday?.start_time)
          );
          form.setValue(
            "tuesday.end_time",
            convertToUTC(applicableDays.Tuesday?.end_time)
          );
        }
        if (applicableDays.Wednesday) {
          form.setValue(
            "wednesday.start_time",
            convertToUTC(applicableDays.Wednesday?.start_time)
          );
          form.setValue(
            "wednesday.end_time",
            convertToUTC(applicableDays.Wednesday?.end_time)
          );
        }
        if (applicableDays.Thursday) {
          form.setValue(
            "thursday.start_time",
            convertToUTC(applicableDays.Thursday?.start_time)
          );
          form.setValue(
            "thursday.end_time",
            convertToUTC(applicableDays.Thursday?.end_time)
          );
        }
        if (applicableDays.Friday) {
          form.setValue(
            "friday.start_time",
            convertToUTC(applicableDays.Friday?.start_time)
          );
          form.setValue(
            "friday.end_time",
            convertToUTC(applicableDays.Friday?.end_time)
          );
        }
        if (applicableDays.Saturday) {
          form.setValue(
            "saturday.start_time",
            convertToUTC(applicableDays.Saturday?.start_time)
          );
          form.setValue(
            "saturday.end_time",
            convertToUTC(applicableDays.Saturday?.end_time)
          );
        }
        if (applicableDays.Sunday) {
          form.setValue(
            "sunday.start_time",
            convertToUTC(applicableDays.Sunday?.start_time)
          );
          form.setValue(
            "sunday.end_time",
            convertToUTC(applicableDays.Sunday?.end_time)
          );
        }
      }
    }
  }, [OfferData, categories]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!session) {
      console.error("Session not available. Cannot submit.");
      return;
    }
    console.log(values);
    setIsSubmitting(true);

    // Create a new FormData instance
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (
        [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ].includes(key)
      ) {
        // Skip appending individual days
        return;
      }
      if (key === "start_offer" || key === "end_offer") {
        if (!isEveryDay) return;
      }
      if (key === "banner") {
        if (value instanceof File) {
          // Read file as blob before appending
          const fileBlob = new Blob([value], { type: value.type });
          formData.append(key, fileBlob, value.name);
        }
      } else if (key === "food_item_ids") {
        // Check if food_item_ids is already an array, otherwise convert to array
        const foodItemArray = Array.isArray(value) ? value : [value];
        foodItemArray.forEach((id) => {
          formData.append("food_item_ids[]", id?.toString());
        });
      } else {
        // Append other values as strings
        formData.append(key, value as string);
      }
    });
    // Assuming formData is an instance of FormData
    if (!isEveryDay) {
      const applicableDays: Record<
        string,
        { start_time: string; end_time: string }
      > = {};

      if (values.monday && values.monday.start_time && values.monday.end_time) {
        applicableDays.Monday = {
          start_time: values.monday.start_time,
          end_time: values.monday.end_time,
        };
      }
      if (
        values.tuesday &&
        values.tuesday.start_time &&
        values.tuesday.end_time
      ) {
        applicableDays.Tuesday = {
          start_time: values.tuesday.start_time,
          end_time: values.tuesday.end_time,
        };
      }
      if (
        values.wednesday &&
        values.wednesday.start_time &&
        values.wednesday.end_time
      ) {
        applicableDays.Wednesday = {
          start_time: values.wednesday.start_time,
          end_time: values.wednesday.end_time,
        };
      }
      if (
        values.thursday &&
        values.thursday.start_time &&
        values.thursday.end_time
      ) {
        applicableDays.Thursday = {
          start_time: values.thursday.start_time,
          end_time: values.thursday.end_time,
        };
      }
      if (values.friday && values.friday.start_time && values.friday.end_time) {
        applicableDays.Friday = {
          start_time: values.friday.start_time,
          end_time: values.friday.end_time,
        };
      }
      if (
        values.saturday &&
        values.saturday.start_time &&
        values.saturday.end_time
      ) {
        applicableDays.Saturday = {
          start_time: values.saturday.start_time,
          end_time: values.saturday.end_time,
        };
      }
      if (values.sunday && values.sunday.start_time && values.sunday.end_time) {
        applicableDays.Sunday = {
          start_time: values.sunday.start_time,
          end_time: values.sunday.end_time,
        };
      }

      // Append applicable_days as an object, not a string
      if (Object.keys(applicableDays).length > 0) {
        for (const day in applicableDays) {
          formData.append(
            `applicable_days[${day}][start_time]`,
            applicableDays[day].start_time
          );
          formData.append(
            `applicable_days[${day}][end_time]`,
            applicableDays[day].end_time
          );
        }
      }
    }

    console.log("FormData:", formData);

    if (OfferData) {
      axiosInstance
        .patch(
          `/moreclub/user/offers/${params.restroId}/${OfferData.id}/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((response) => {
          console.log("Updated Offer", response);
          toast.success("Successfully updated offer!", {
            duration: 5000,
            position: "top-right",
          });
        })
        .catch((error) => {
          console.log("Error updating Offer", error);
          toast.error("Error updating offer!", {
            duration: 5000,
            position: "top-right",
          });
        })
        .finally(() => {
          setIsSubmitting(false);
          setImagePreview(null);
          form.reset();
        });
    } else {
      axiosInstance
        .post(`/moreclub/user/offers/${params.restroId}/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log("Added Offer", response);
          toast.success("Successfully added offer!", {
            duration: 5000,
            position: "top-right",
          });
        })
        .catch((error) => {
          console.log("Error adding Offer", error);
          toast.error("Error adding offer!", {
            duration: 5000,
            position: "top-right",
          });
        })
        .finally(() => {
          setIsSubmitting(false);
          setImagePreview(null);
          form.reset();
        });
    }
  }

  return (
    <ScrollArea className="bg-white dark:bg-secondary_dark p-6 h-[88vh]">
      <Breadcrumb className="mb-4 -ml-1">
        <BreadcrumbList className="flex sm:gap-1">
          <BreadcrumbItem>
            <BreadcrumbLink
              href={`/restaurant/${params.restroId}/${params.restroName}/offer`}
            >
              <CgArrowLeft
                className="text-primary_text dark:text-sidebar_blue"
                size={25}
              />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbPage className="sm:text-xl text-sm font-medium text-primary_text dark:text-sidebar_blue">
              Add New Offer
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="grid sm:grid-cols-2 grid-cols-1 sm:gap-8 gap-4">
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="menu_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          const selectedCategory = categories.find(
                            (category: RestroMenuList) =>
                              category.name === value
                          );
                          if (selectedCategory) {
                            setSelectedCategoryId(selectedCategory.id); // Update local state
                            field.onChange(selectedCategory.id); // Update form state
                            setFoodItems([]); // Clear food items
                          } else {
                            setSelectedCategoryId("");
                            field.onChange(""); // Clear form state
                          }
                        }}
                        value={
                          selectedCategoryId
                            ? categories.find(
                                (cat) => cat.id === selectedCategoryId
                              )?.name
                            : ""
                        }
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.name}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <FormField
                control={form.control}
                name="food_item_ids"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Food Items</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          const item = foodItems.find(
                            (item) => item.name === value
                          );
                          if (item) {
                            // Check if the item is already selected
                            const isAlreadySelected = selectedFoodItems.some(
                              (selectedItem) => selectedItem.id === item.id
                            );
                            if (!isAlreadySelected) {
                              handleFoodItemAdd(item); // Update local state
                              const updatedIds = [
                                ...(field.value || []),
                                item.id,
                              ];
                              field.onChange(updatedIds); // Update form state
                            }
                          }
                        }}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Select a food item" />
                        </SelectTrigger>
                        <SelectContent>
                          {foodItems.map((item) => (
                            <SelectItem key={item.id} value={item.name}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="mt-4 flex flex-col gap-3">
                <FormLabel>Selected Food Items</FormLabel>
                <ul
                  className="flex gap-4 rounded-md border border-input bg-background py-[14px] p-4 text-sm 
                ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium 
                placeholder:text-muted-foreground focus-visible:outline-none  disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {selectedFoodItems.map((item, index) => (
                    <li
                      key={`${item.id}-${index}`}
                      className="inline-flex gap-2 items-center bg-primary_text dark:bg-sidebar_blue text-white px-2 py-1 rounded-full"
                    >
                      <span className="text-sm text-white">{item.name}</span>
                      <button
                        type="button"
                        className=" bg-white rounded-full p-1"
                        onClick={() =>
                          setSelectedFoodItems((prev) =>
                            prev.filter((_, i) => i !== index)
                          )
                        }
                      >
                        <RxCross2 color="red" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div> */}

              <FormField
                control={form.control}
                name="food_item_ids"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Food Item</FormLabel>
                    <FormControl>
                      <div className="flex flex-col gap-2">
                        {/* Selected services as chips */}
                        <div className="flex flex-wrap gap-2">
                          {form.getValues("food_item_ids").map((itemId) => {
                            const selectedFoodItem = foodItems.find(
                              (item) => item.id === itemId
                            );
                            return (
                              <div
                                key={itemId}
                                className="inline-flex gap-2 items-center bg-primary_text dark:bg-sidebar_blue text-white px-2 py-1 rounded-full"
                              >
                                <span className="text-sm text-white">
                                  {selectedFoodItem?.name}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    form.setValue(
                                      "food_item_ids",
                                      form
                                        .getValues("food_item_ids")
                                        .filter((id) => id !== itemId)
                                    );
                                  }}
                                  className=" bg-white rounded-full p-1"
                                >
                                  <RxCross2 color="red" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                        {/* Dropdown to select services */}
                        <Select
                          onValueChange={(value) => {
                            const selectedFoodItem = foodItems.find(
                              (item) => item.id === value
                            );
                            if (selectedFoodItem) {
                              // Add the food item if not already selected
                              if (
                                !form
                                  .getValues("food_item_ids")
                                  .includes(selectedFoodItem.id)
                              ) {
                                form.setValue("food_item_ids", [
                                  ...form.getValues("food_item_ids"),
                                  selectedFoodItem.id,
                                ]);
                              }
                            }
                          }}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue placeholder="Select food item" />
                          </SelectTrigger>
                          <SelectContent>
                            {foodItems.map((item) => (
                              <SelectItem key={item.id} value={item.id}>
                                {item.name}({item.value}) Rs.{" "}
                                {Number(item.price) -
                                  Number(item.discount_price)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-4">
              <div className="grid sm:grid-cols-2 grid-cols-1 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Offer Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="banner"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Banner Image</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        {imagePreview && (
                          <Image
                            src={imagePreview || ""}
                            alt="Logo Preview"
                            className="w-16 h-16 object-cover"
                            width={200}
                            height={200}
                          />
                        )}
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              field.onChange(file); // Set the new file in the form state
                              const fileURL = URL.createObjectURL(file); // Update preview URL
                              setImagePreview(fileURL); // Update preview
                            }
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex gap-2 items-center sm:mt-0 mt-2 mb-1">
            <Checkbox
              checked={isSpecificDay}
              onCheckedChange={() => {
                const newIsEveryDay = !isEveryDay; // Calculate the new value
                setIsSpecificDay(!isSpecificDay);
                setIsEveryDay(newIsEveryDay);
                form.setValue("is_everyday", newIsEveryDay); // Use the updated value
              }}
            />
            <Label>Specific Days/Time</Label>
          </div>
          {isSpecificDay ? (
            <div className="grid sm:grid-cols-2 grid-cols-1 gap-x-4 gap-y-6">
              <div className="flex sm:flex-row flex-col gap-4 sm:gap-12 ">
                <FormLabel className="text-deep_red dark:text-white">
                  Monday
                </FormLabel>
                <div className="grid sm:grid-cols-2 grid-cols-1 sm:gap-6 gap-3 ">
                  <FormField
                    control={form.control}
                    name="monday.start_time"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel className="text-black dark:text-sidebar_blue">
                          Start Offer
                        </FormLabel>
                        <FormControl>
                          <DatePicker
                            selected={
                              field.value ? new Date(field.value) : null
                            }
                            onChange={(time) => {
                              if (time) {
                                const nextMondayWithTime = getNextDayWithTime(
                                  1,
                                  time
                                ); // 1 = Monday
                                const formattedDate = new Date(
                                  nextMondayWithTime
                                ).toISOString();
                                field.onChange(formattedDate);
                              }
                            }}
                            showTimeSelect
                            showTimeSelectOnly
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="HH:mm"
                            className="border p-2 rounded w-full text-sm"
                            placeholderText="Select time"
                            timeCaption="Time"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="monday.end_time"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel className="text-black dark:text-sidebar_blue">
                          End Offer
                        </FormLabel>
                        <FormControl>
                          <DatePicker
                            selected={
                              field.value ? new Date(field.value) : null
                            }
                            onChange={(time) => {
                              if (time) {
                                const nextMondayWithTime = getNextDayWithTime(
                                  1,
                                  time
                                ); // 1 = Monday
                                const formattedDate = new Date(
                                  nextMondayWithTime
                                ).toISOString();
                                field.onChange(formattedDate);
                              }
                            }}
                            showTimeSelect
                            showTimeSelectOnly
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="HH:mm"
                            className="border p-2 rounded w-full text-sm"
                            placeholderText="Select time"
                            timeCaption="Time"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex sm:flex-row flex-col gap-4 sm:gap-11">
                <FormLabel className="text-deep_red dark:text-white">
                  Tuesday
                </FormLabel>
                <div className="grid sm:grid-cols-2 grid-cols-1 sm:gap-6 gap-3 ">
                  <FormField
                    control={form.control}
                    name="tuesday.start_time"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel className="text-black dark:text-sidebar_blue">
                          Start Offer
                        </FormLabel>
                        <FormControl>
                          <DatePicker
                            selected={
                              field.value ? new Date(field.value) : null
                            }
                            onChange={(time) => {
                              if (time) {
                                const nextTuesdayWithTime = getNextDayWithTime(
                                  2,
                                  time
                                ); // 2 = Tuesday
                                const formattedDate = new Date(
                                  nextTuesdayWithTime
                                ).toISOString();
                                field.onChange(formattedDate);
                              }
                            }}
                            showTimeSelect
                            showTimeSelectOnly
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="HH:mm"
                            className="border p-2 rounded w-full text-sm"
                            placeholderText="Select time"
                            timeCaption="Time"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tuesday.end_time"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel className="text-black dark:text-sidebar_blue">
                          End Offer
                        </FormLabel>
                        <FormControl>
                          <DatePicker
                            selected={
                              field.value ? new Date(field.value) : null
                            }
                            onChange={(time) => {
                              if (time) {
                                const nextTuesdayWithTime = getNextDayWithTime(
                                  2,
                                  time
                                ); // 2 = Tuesday
                                const formattedDate = new Date(
                                  nextTuesdayWithTime
                                ).toISOString();
                                field.onChange(formattedDate);
                              }
                            }}
                            showTimeSelect
                            showTimeSelectOnly
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="HH:mm"
                            className="border p-2 rounded w-full text-sm"
                            placeholderText="Select time"
                            timeCaption="Time"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex sm:flex-row flex-col gap-4 sm:gap-[22px]">
                <FormLabel className="text-deep_red dark:text-white">
                  Wednesday
                </FormLabel>
                <div className="grid sm:grid-cols-2 grid-cols-1 sm:gap-6 gap-3 ">
                  <FormField
                    control={form.control}
                    name="wednesday.start_time"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel className="text-black dark:text-sidebar_blue">
                          Start Offer
                        </FormLabel>
                        <FormControl>
                          <DatePicker
                            selected={
                              field.value ? new Date(field.value) : null
                            }
                            onChange={(time) => {
                              if (time) {
                                const nextWednesdayWithTime =
                                  getNextDayWithTime(3, time); // 3 = Wednesday
                                const formattedDate = new Date(
                                  nextWednesdayWithTime
                                ).toISOString();
                                field.onChange(formattedDate);
                              }
                            }}
                            showTimeSelect
                            showTimeSelectOnly
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="HH:mm"
                            className="border p-2 rounded w-full text-sm"
                            placeholderText="Select time"
                            timeCaption="Time"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="wednesday.end_time"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel className="text-black dark:text-sidebar_blue">
                          End Offer
                        </FormLabel>
                        <FormControl>
                          <DatePicker
                            selected={
                              field.value ? new Date(field.value) : null
                            }
                            onChange={(time) => {
                              if (time) {
                                const nextWednesdayWithTime =
                                  getNextDayWithTime(3, time); // 3 = Wednesday
                                const formattedDate = new Date(
                                  nextWednesdayWithTime
                                ).toISOString();
                                field.onChange(formattedDate);
                              }
                            }}
                            showTimeSelect
                            showTimeSelectOnly
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="HH:mm"
                            className="border p-2 rounded w-full text-sm"
                            placeholderText="Select time"
                            timeCaption="Time"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex sm:flex-row flex-col gap-4 sm:gap-[37px]">
                <FormLabel className="text-deep_red dark:text-white">
                  Thursday
                </FormLabel>
                <div className="grid sm:grid-cols-2 grid-cols-1 sm:gap-6 gap-3 ">
                  <FormField
                    control={form.control}
                    name="thursday.start_time"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel className="text-black dark:text-sidebar_blue">
                          Start Offer
                        </FormLabel>
                        <FormControl>
                          <DatePicker
                            selected={
                              field.value ? new Date(field.value) : null
                            }
                            onChange={(time) => {
                              if (time) {
                                const nextThursdayWithTime = getNextDayWithTime(
                                  4,
                                  time
                                ); // 4 = Thursday
                                const formattedDate = new Date(
                                  nextThursdayWithTime
                                ).toISOString();
                                field.onChange(formattedDate);
                              }
                            }}
                            showTimeSelect
                            showTimeSelectOnly
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="HH:mm"
                            className="border p-2 rounded w-full text-sm"
                            placeholderText="Select time"
                            timeCaption="Time"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="thursday.end_time"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel className="text-black dark:text-sidebar_blue">
                          End Offer
                        </FormLabel>
                        <FormControl>
                          <DatePicker
                            selected={
                              field.value ? new Date(field.value) : null
                            }
                            onChange={(time) => {
                              if (time) {
                                const nextThursdayWithTime = getNextDayWithTime(
                                  4,
                                  time
                                ); // 4 = Thursday
                                const formattedDate = new Date(
                                  nextThursdayWithTime
                                ).toISOString();
                                field.onChange(formattedDate);
                              }
                            }}
                            showTimeSelect
                            showTimeSelectOnly
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="HH:mm"
                            className="border p-2 rounded w-full text-sm"
                            placeholderText="Select time"
                            timeCaption="Time"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex sm:flex-row flex-col gap-4 sm:gap-[58px]">
                <FormLabel className="text-deep_red dark:text-white">
                  Friday
                </FormLabel>
                <div className="grid sm:grid-cols-2 grid-cols-1 sm:gap-6 gap-3 ">
                  <FormField
                    control={form.control}
                    name="friday.start_time"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel className="text-black dark:text-sidebar_blue">
                          Start Offer
                        </FormLabel>
                        <FormControl>
                          <DatePicker
                            selected={
                              field.value ? new Date(field.value) : null
                            }
                            onChange={(time) => {
                              if (time) {
                                const nextFridayWithTime = getNextDayWithTime(
                                  5,
                                  time
                                ); // 5 = Friday
                                const formattedDate = new Date(
                                  nextFridayWithTime
                                ).toISOString();
                                field.onChange(formattedDate);
                              }
                            }}
                            showTimeSelect
                            showTimeSelectOnly
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="HH:mm"
                            className="border p-2 rounded w-full text-sm"
                            placeholderText="Select time"
                            timeCaption="Time"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="friday.end_time"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel className="text-black dark:text-sidebar_blue">
                          End Offer
                        </FormLabel>
                        <FormControl>
                          <DatePicker
                            selected={
                              field.value ? new Date(field.value) : null
                            }
                            onChange={(time) => {
                              if (time) {
                                const nextFridayWithTime = getNextDayWithTime(
                                  5,
                                  time
                                ); // 5 = Friday
                                const formattedDate = new Date(
                                  nextFridayWithTime
                                ).toISOString();
                                field.onChange(formattedDate);
                              }
                            }}
                            showTimeSelect
                            showTimeSelectOnly
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="HH:mm"
                            className="border p-2 rounded w-full text-sm"
                            placeholderText="Select time"
                            timeCaption="Time"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex sm:flex-row flex-col gap-4 sm:gap-10">
                <FormLabel className="text-deep_red dark:text-white">
                  Saturday
                </FormLabel>
                <div className="grid sm:grid-cols-2 grid-cols-1 sm:gap-6 gap-3 ">
                  <FormField
                    control={form.control}
                    name="saturday.start_time"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel className="text-black dark:text-sidebar_blue">
                          Start Offer
                        </FormLabel>
                        <FormControl>
                          <DatePicker
                            selected={
                              field.value ? new Date(field.value) : null
                            }
                            onChange={(time) => {
                              if (time) {
                                const nextSaturdayWithTime = getNextDayWithTime(
                                  6,
                                  time
                                ); // 6 = Saturday
                                const formattedDate = new Date(
                                  nextSaturdayWithTime
                                ).toISOString();
                                field.onChange(formattedDate);
                              }
                            }}
                            showTimeSelect
                            showTimeSelectOnly
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="HH:mm"
                            className="border p-2 rounded w-full text-sm"
                            placeholderText="Select time"
                            timeCaption="Time"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="saturday.end_time"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel className="text-black dark:text-sidebar_blue">
                          End Offer
                        </FormLabel>
                        <FormControl>
                          <DatePicker
                            selected={
                              field.value ? new Date(field.value) : null
                            }
                            onChange={(time) => {
                              if (time) {
                                const nextSaturdayWithTime = getNextDayWithTime(
                                  6,
                                  time
                                ); // 6 = Saturday
                                const formattedDate = new Date(
                                  nextSaturdayWithTime
                                ).toISOString();
                                field.onChange(formattedDate);
                              }
                            }}
                            showTimeSelect
                            showTimeSelectOnly
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="HH:mm"
                            className="border p-2 rounded w-full text-sm"
                            placeholderText="Select time"
                            timeCaption="Time"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex sm:flex-row flex-col gap-4 sm:gap-12">
                <FormLabel className="text-deep_red dark:text-white">
                  Sunday
                </FormLabel>
                <div className="grid sm:grid-cols-2 grid-cols-1 sm:gap-6 gap-3 ">
                  <FormField
                    control={form.control}
                    name="sunday.start_time"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel className="text-black dark:text-sidebar_blue">
                          Start Offer
                        </FormLabel>
                        <FormControl>
                          <DatePicker
                            selected={
                              field.value ? new Date(field.value) : null
                            }
                            onChange={(time) => {
                              if (time) {
                                const nextSundayWithTime = getNextDayWithTime(
                                  7,
                                  time
                                ); // 7 = Sunday
                                const formattedDate = new Date(
                                  nextSundayWithTime
                                ).toISOString();
                                field.onChange(formattedDate);
                              }
                            }}
                            showTimeSelect
                            showTimeSelectOnly
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="HH:mm"
                            className="border p-2 rounded w-full text-sm"
                            placeholderText="Select time"
                            timeCaption="Time"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sunday.end_time"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel className="text-black dark:text-sidebar_blue">
                          End Offer
                        </FormLabel>
                        <FormControl>
                          <DatePicker
                            selected={
                              field.value ? new Date(field.value) : null
                            }
                            onChange={(time) => {
                              if (time) {
                                const nextSundayWithTime = getNextDayWithTime(
                                  7,
                                  time
                                ); // 7 = Sunday
                                const formattedDate = new Date(
                                  nextSundayWithTime
                                ).toISOString();
                                field.onChange(formattedDate);
                              }
                            }}
                            showTimeSelect
                            showTimeSelectOnly
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="HH:mm"
                            className="border p-2 rounded w-full text-sm"
                            placeholderText="Select time"
                            timeCaption="Time"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="start_offer"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel className="text-black dark:text-sidebar_blue">
                      Start Offer
                    </FormLabel>
                    <FormControl>
                      <DatePicker
                        selected={field.value ? new Date(field.value) : null}
                        onChange={(date) => {
                          if (date) {
                            const formattedDate = date.toISOString();
                            field.onChange(formattedDate);
                          }
                        }}
                        showTimeSelect
                        timeFormat="HH:mm:ss"
                        timeIntervals={15} // Controls the time interval (e.g., 15 minutes)
                        dateFormat="yyyy-MM-dd HH:mm:ss" // Display format only (not the submitted format)
                        className="border p-2 rounded w-full text-sm"
                        placeholderText="Select date and time"
                        timeCaption="Time"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_offer"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel className="text-black dark:text-sidebar_blue">
                      End Offer
                    </FormLabel>
                    <FormControl>
                      <DatePicker
                        selected={field.value ? new Date(field.value) : null}
                        onChange={(date) => {
                          if (date) {
                            const formattedDate = date.toISOString();
                            field.onChange(formattedDate);
                          }
                        }}
                        showTimeSelect
                        timeFormat="HH:mm:ss"
                        timeIntervals={15} // Controls the time interval (e.g., 15 minutes)
                        dateFormat="yyyy-MM-dd HH:mm:ss" // Display format only (not the submitted format)
                        className="border p-2 rounded w-full text-sm"
                        placeholderText="Select date and time"
                        timeCaption="Time"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          <Button
            type="submit"
            onClick={() => {
              console.log("Button Clicked!");
              console.log("Form Values: ", form.getValues());
            }}
            className="bg-primary_text dark:bg-sidebar_blue hover:bg-l_orange dark:hover:bg-blue text-white h-8 mt-6 mb-3 place-self-start rounded-lg"
          >
            {isSubmitting ? (
              <Loader />
            ) : OfferData ? (
              "Update Offer"
            ) : (
              "Add Offer"
            )}
          </Button>
        </form>
      </Form>
    </ScrollArea>
  );
};

export default Page;

// start_offer: 2024-12-01T11:21
// end_offer: 2024-12-31T11:21
// price: 350
// description: December Sale
// banner: (binary)
// food_item_ids[]: 528cad72-2c74-4661-99a1-6bd1521a4e1a
// food_item_ids[]: 8e9baf2f-aad2-4916-9e93-86ee78e3bd7d
// name: December Sale
