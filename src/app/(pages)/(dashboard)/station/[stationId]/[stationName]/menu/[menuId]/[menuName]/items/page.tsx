"use client";

import useAxiosPrivateFood from "@/hooks/useAxiosPrivateFood";
import { useFoodItemList } from "@/lib/react-query/queriesAndMutations";
import {
  clearFoodItem,
  setFoodItem,
} from "@/lib/store/features/foodItem/foodItemSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { FoodItem } from "@/types/types";
import axios from "axios";
import { Open_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineDelete } from "react-icons/ai";
import { CiEdit } from "react-icons/ci";
import { HiPlusSmall } from "react-icons/hi2";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CgArrowLeft } from "react-icons/cg";
import DialogLoader from "@/components/ui/DialogLoader";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "next-auth/react";
import { RootState } from "@/lib/store/store";
import Loader from "@/components/ui/Loader";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "name can't be empty.",
  }),
  image: z.instanceof(File).optional(),
  price: z.string(),
  retailer_price: z.string(),
  offerPrice: z.string(),
  short_description: z.string().min(6, {
    message: "Short Description must be atleast 6 characters",
  }),
  is_active: z.boolean(),
  ingredient: z.string(),
});

const open_sans = Open_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const Page = ({
  params,
}: {
  params: {
    stationId: string;
    stationName: string;
    menuId: string;
    menuName: string;
  };
}) => {
  const dispatch = useAppDispatch();
  const axiosInstance = useAxiosPrivateFood();
  const MenuName = decodeURIComponent(params.menuName);
  const menuName = decodeURIComponent(params.menuName);
  const itemData = useAppSelector(
    (state: RootState) => state.foodItem.currentFoodItems
  );

  const [deletingItem, setDeletingItem] = useState<FoodItem | null>(null);
  const { data: foodList, isLoading: isLoading } = useFoodItemList(
    params.stationId,
    params.menuId
  );

  const { data: session } = useSession();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      image: undefined,
      price: "",
      retailer_price: "",
      offerPrice: "",
      short_description: "",
      is_active: itemData?.is_active || false,
      ingredient: "",
    },
  });

  useEffect(() => {
    if (itemData) {
      form.setValue("name", itemData.name || "");
      form.setValue("ingredient", itemData.ingredient);
      form.setValue("offerPrice", itemData.item_price.toString());
      form.setValue("price", itemData.actual_price.toString());
      form.setValue("retailer_price", itemData.retailer_price);
      form.setValue("short_description", itemData.short_description);
      form.setValue("is_active", itemData.is_active);

      setImagePreview(itemData.image);
    }
  }, [itemData]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!session) {
      console.error("Session not available. Cannot submit.");
      return;
    }
    console.log(values);
    // Create a new FormData instance
    const formData = new FormData();
    setIsSubmitting(true);

    Object.entries(values).forEach(([key, value]) => {
      if (key === "image") {
        if (value instanceof File) {
          // Read file as blob before appending
          const fileBlob = new Blob([value], { type: value.type });
          formData.append(key, fileBlob, value.name);
        }
      } else {
        // Append other values as strings
        formData.append(key, value as string);
      }
    });

    if (itemData) {
      axiosInstance
        .patch(
          `/moreclub/station/${params.stationId}/${params.menuId}/${itemData.id}/food-items/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((response) => {
          console.log("Form submitted successfully:", response.data);
          form.reset(); // Clear form after successful submission
          toast.success("Food item Updated Successfully!", {
            duration: 5000,
            position: "top-right",
          });
        })
        .catch((error) => {
          console.error("Error submitting form:", error);
          toast.error("Error updating food item!", {
            duration: 5000,
            position: "top-right",
          });
        })
        .finally(() => {
          dispatch(clearFoodItem());
          setIsSubmitting(false);
          setImagePreview(null);
        });
    } else {
      axiosInstance
        .post(
          `/moreclub/station/${params.stationId}/${params.menuId}/food-items/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((response) => {
          console.log("Form submitted successfully:", response.data);
          form.reset();
          toast.success("Food Item Added Successfully!", {
            duration: 5000,
            position: "top-right",
          });
        })
        .catch((error) => {
          console.error("Error submitting form:", error);
          toast.error("Error adding food item!", {
            duration: 5000,
            position: "top-right",
          });
        })
        .finally(() => {
          setIsSubmitting(false);
          setImagePreview(null);
        });
    }
  }

  useEffect(() => {
    dispatch(clearFoodItem());
  }, [dispatch]);

  const deleteItem = async (food: FoodItem, foodId: string) => {
    setDeletingItem(food);
    axiosInstance
      .delete(
        `/moreclub/station/${params.stationId}/${params.menuId}/${foodId}/food-items/`
      )
      .then((response) => {
        console.log(`Deleted ${food.name}`, response);
        toast.success(`Deleted ${food.name}!`, {
          duration: 5000,
          position: "top-right",
        });
      })
      .catch((error) => {
        console.log(`Error deleting ${food.name}`, error);
        toast.error(`Error deleting ${food.name}!`, {
          duration: 5000,
          position: "top-right",
        });
      })
      .finally(() => {
        setDeletingItem(null);
      });
  };

  return (
    <div
      className={` bg-white dark:bg-secondary_dark rounded-sm p-6 flex flex-col gap-6 shadow-sm shadow-vll_gray dark:shadow-none ${open_sans.className}`}
    >
      <div className="flex sm:flex-row flex-col sm:justify-between sm:gap-0 gap-4">
        <Breadcrumb className="mb-4 -ml-1">
          <BreadcrumbList className="flex sm:gap-1">
            <BreadcrumbItem>
              <BreadcrumbLink
                href={`/station/${params.stationId}/${params.stationName}/menu/`}
              >
                <CgArrowLeft
                  className="text-primary_text dark:text-sidebar_blue"
                  size={25}
                />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage className="sm:text-xl text-sm font-medium text-primary_text dark:text-sidebar_blue">
                {MenuName} Items
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex gap-4">
          {/* <Link
            href={`/station/${params.stationId}/${params.stationName}/menu/${params.menuId}/${params.menuName}/items/create`}
            className="bg-primary_text dark:bg-btn_blue text-white text-sm hover:bg-l_orange dark:hover:bg-blue py-1 px-4 rounded place-self-end"
          >
            <div className="flex gap-1 items-center">
              Add New Item <HiPlusSmall size={23} />
            </div>

          </Link> */}
          <Dialog>
            <DialogTrigger className="flex gap-1 items-center bg-primary_text dark:bg-btn_blue text-white text-sm hover:bg-l_orange dark:hover:bg-blue py-1 px-4 rounded place-self-end">
              Add New Item <HiPlusSmall size={23} />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {itemData
                    ? `Update ${itemData.name}`
                    : `Add Food Item for ${menuName}`}
                </DialogTitle>
                <DialogDescription>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="flex flex-col gap-4"
                    >
                      <div className="grid sm:grid-cols-2 grid-cols-1 sm:gap-8 gap-4">
                        <div className="flex flex-col gap-4">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="retailer_price"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Retailer Price</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />{" "}
                          <FormField
                            control={form.control}
                            name="short_description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Short Description</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="is_active"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Is Active</FormLabel>
                                <FormControl>
                                  <Select
                                    onValueChange={(value) =>
                                      field.onChange(value === "true")
                                    }
                                    defaultValue={
                                      field.value ? "true" : "false"
                                    } // Set initial value
                                  >
                                    <SelectTrigger className="w-[180px]">
                                      <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="true">True</SelectItem>
                                      <SelectItem value="false">
                                        False
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="flex flex-col gap-4">
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
                          <FormField
                            control={form.control}
                            name="offerPrice"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Offer Price</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="ingredient"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Ingredient</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Image</FormLabel>
                                <FormControl>
                                  <div className="flex items-center gap-4">
                                    {imagePreview && (
                                      <Image
                                        src={imagePreview}
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
                                          const fileURL =
                                            URL.createObjectURL(file); // Update preview URL
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
                        className="bg-primary_text dark:bg-sidebar_blue hover:bg-l_orange dark:hover:bg-blue text-white h-8 mb-6 place-self-start rounded-lg"
                      >
                        <DialogClose>
                          {isSubmitting ? (
                            <Loader />
                          ) : itemData ? (
                            "Edit"
                          ) : (
                            "Add"
                          )}
                        </DialogClose>
                      </Button>
                    </form>
                  </Form>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="">
        {isLoading ? (
          <p>Loading Food Item List...</p>
        ) : foodList && foodList?.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {foodList.map((food: FoodItem, index: any) => (
              <div
                key={index}
                className="flex flex-col gap-2 dark:bg-primary_dark bg-white rounded-md shadow-md shadow-vll_gray dark:shadow-none"
              >
                <div className="relative">
                  <Link
                    href={`/station/${params.stationId}/${params.stationName}/menu/${params.menuId}/${params.menuName}/items/${food.id}/${food.name}`}
                  >
                    <Image
                      src={food.image || ""}
                      alt="menu icon"
                      width={100}
                      height={100}
                      className="w-40 h-32 rounded-t-md"
                    />
                  </Link>
                  <button
                    className="absolute right-0 top-0 bg-red-500 text-white hover:bg-white hover:text-red-500 dark:bg-sidebar_blue p-1 rounded-tr-md "
                    onClick={() => {
                      deleteItem(food, food.id);
                    }}
                  >
                    <AiOutlineDelete size={22} className="" />
                  </button>
                </div>
                <div className="flex justify-between px-2  pb-4">
                  <h2 className="text-primary_text dark:text-sidebar_blue font-medium place-self-center text-sm capitalize">
                    {food.name}
                  </h2>
                  <Link
                    href={`/station/${params.stationId}/${params.stationName}/menu/${params.menuId}/${params.menuName}/items/create`}
                    onClick={() => {
                      dispatch(setFoodItem(food));
                    }}
                    className=""
                  >
                    <CiEdit
                      size={22}
                      className="text-primary_text dark:text-sidebar_blue "
                    />
                  </Link>
                </div>
                {deletingItem ? (
                  <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-25 flex justify-center items-center z-50">
                    <div className="bg-white sm:p-8 p-4 rounded shadow-lg lg:w-[30vw] sm:w-[50vw] w-[96vw] flex flex-col gap-2 items-center justify-center">
                      <DialogLoader />
                      <p className="text-black font-normal text-base">
                        Deleting {deletingItem.name}...
                      </p>
                      <button
                        onClick={() => {
                          setDeletingItem(null);
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
        ) : foodList?.length <= 0 ? (
          <p>No items found! Add new items.</p>
        ) : (
          <p>Couldn&apos;t load food items!</p>
        )}
      </div>
    </div>
  );
};

export default Page;
