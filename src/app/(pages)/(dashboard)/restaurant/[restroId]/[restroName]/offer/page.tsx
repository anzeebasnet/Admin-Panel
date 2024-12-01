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
import { Cuisine, RestroFoodItem, RestroMenuList } from "@/types/types";
import {
  useRestroItemList,
  useRestroMenuList,
} from "@/lib/react-query/queriesAndMutations";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import CSS for DatePicker styling

const formSchema = z.object({
  name: z.string().min(2, {
    message: "name can't be empty.",
  }),
  banner: z.instanceof(File).optional(),
  price: z.string(),
  description: z.string().min(6, {
    message: "Short Description must be atleast 6 characters",
  }),
  start_offer: z
    .string()
    .refine(
      (val) => !isNaN(new Date(val).getTime()),
      "Start Offer must be a valid date and time."
    ),
  end_offer: z
    .string()
    .refine(
      (val) => !isNaN(new Date(val).getTime()),
      "End Offer must be a valid date and time."
    ),
  food_item_ids: z
    .array(z.string())
    .nonempty("Please select at least one food item."),
  menu_id: z.string(),
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
  const [foodItems, setFoodItems] = useState<RestroFoodItem[]>([]); // Food items based on the selected category
  const [selectedCategoryId, setSelectedCategoryId] = useState(""); // Selected category ID
  const [selectedFoodItems, setSelectedFoodItems] = useState<RestroFoodItem[]>(
    []
  ); // Array of selected food items (with duplicates)

  const { data: restroMenuList } = useRestroMenuList(params.restroId);
  const token = session?.accessToken || session?.user.token;
  const axiosInstance = useAxiosPrivateFood();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      banner: undefined,
      price: "",
      description: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!session) {
      console.error("Session not available. Cannot submit.");
      return;
    }
    console.log(values);

    // Create a new FormData instance
    const formData = new FormData();
    // setIsSubmitting(true);

    Object.entries(values).forEach(([key, value]) => {
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
          formData.append("food_item_ids[]", id?.toString()); // Use `cuisine_id[]` for array in FormData
        });
      } else {
        // Append other values as strings
        formData.append(key, value as string);
      }
    });

    console.log("FormData:", formData);
  }

  const handleFoodItemAdd = (item: RestroFoodItem) => {
    setSelectedFoodItems((prev) => [...prev, item]);
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

  return (
    <ScrollArea className="bg-white dark:bg-secondary_dark p-6 h-[88vh]">
      <h1
        className={`text-primary_text dark:text-sidebar_blue text-lg font-medium mb-4 ${open_sans.className}`}
      >
        Add New Offer
      </h1>
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
              <FormField
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
                            handleFoodItemAdd(item); // Update local state
                            const updatedIds = [
                              ...(field.value || []),
                              item.id,
                            ];
                            field.onChange(updatedIds); // Update form state
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
                <ul className=" rounded-md border border-input bg-background py-[14px] p-4 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none  disabled:cursor-not-allowed disabled:opacity-50">
                  {selectedFoodItems.map((item, index) => (
                    <li
                      key={`${item.id}-${index}`}
                      className="flex justify-between items-center mb-2"
                    >
                      <span>{item.name}</span>
                      <button
                        type="button"
                        className="text-red-500"
                        onClick={() =>
                          setSelectedFoodItems((prev) =>
                            prev.filter((_, i) => i !== index)
                          )
                        }
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="start_offer"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2">
                      <FormLabel>Start Offer</FormLabel>
                      <FormControl>
                        <DatePicker
                          selected={field.value ? new Date(field.value) : null}
                          onChange={(date) => {
                            if (date) {
                              const formattedDate = `${date.getFullYear()}-${(
                                date.getMonth() + 1
                              )
                                .toString()
                                .padStart(2, "0")}-${date
                                .getDate()
                                .toString()
                                .padStart(2, "0")}T${date
                                .getHours()
                                .toString()
                                .padStart(2, "0")}:${date
                                .getMinutes()
                                .toString()
                                .padStart(2, "0")}`;
                              field.onChange(formattedDate);
                            }
                          }}
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={15} // Controls the time interval (e.g., 15 minutes)
                          dateFormat="yyyy-MM-dd HH:mm" // Controls the date format
                          className="border p-2 rounded w-full"
                          placeholderText="Select start date and time"
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
                      <FormLabel>End Offer</FormLabel>
                      <FormControl>
                        <DatePicker
                          selected={field.value ? new Date(field.value) : null}
                          onChange={(date) => {
                            if (date) {
                              const formattedDate = `${date.getFullYear()}-${(
                                date.getMonth() + 1
                              )
                                .toString()
                                .padStart(2, "0")}-${date
                                .getDate()
                                .toString()
                                .padStart(2, "0")}T${date
                                .getHours()
                                .toString()
                                .padStart(2, "0")}:${date
                                .getMinutes()
                                .toString()
                                .padStart(2, "0")}`;
                              field.onChange(formattedDate);
                            }
                          }}
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={15}
                          dateFormat="yyyy-MM-dd HH:mm"
                          className="border p-2 rounded w-full"
                          placeholderText="Select end date and time"
                          timeCaption="Time"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
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
          <Button
            type="submit"
            onClick={() => {
              console.log("Button Clicked!");
              console.log("Form Values: ", form.getValues());
            }}
            className="bg-primary_text dark:bg-sidebar_blue hover:bg-l_orange dark:hover:bg-blue text-white h-8 mb-6 place-self-start rounded-lg"
          >
            Add Offer
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
