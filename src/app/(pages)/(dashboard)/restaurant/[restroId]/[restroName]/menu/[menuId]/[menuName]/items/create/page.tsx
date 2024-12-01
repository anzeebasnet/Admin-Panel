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
import toast from "react-hot-toast";
import { clearFoodItem } from "@/lib/store/features/foodItem/foodItemSlice";
import Loader from "@/components/ui/Loader";
import axios from "axios";
import { Textarea } from "@/components/ui/textarea";
import { Cuisine } from "@/types/types";
import { clearRestroItem } from "@/lib/store/features/restroItem/restroItemSlice";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "name can't be empty.",
  }),
  image: z.instanceof(File).optional(),
  price: z.string(),
  discount_price: z.string(),
  short_description: z.string().min(6, {
    message: "Short Description must be atleast 6 characters",
  }),
  ingredient: z.string(),
  cuisine_id: z.number(),
  restaurant_id: z.string(),
  menu: z.string(),
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
    menuId: string;
    menuName: string;
  };
}) => {
  const { data: session } = useSession();
  const axiosInstance = useAxiosPrivateFood();
  const MenuName = decodeURIComponent(params.menuName);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [cuisines, setCuisines] = useState<Cuisine[]>([]);
  const [selectedCuisineId, setSelectedCuisineId] = useState<number | null>(
    null
  );

  const dispatch = useAppDispatch();
  const itemData = useAppSelector(
    (state: RootState) => state.restroFoodItem.currentRestroItem
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      image: undefined,
      price: "",
      discount_price: "",
      short_description: "",
      ingredient: "",
      restaurant_id: params.restroId,
      menu: params.menuId,
    },
  });

  const fetchCuisine = async () => {
    try {
      const res = await axiosInstance.get(
        `/moreclub/user/cuisines/${params.restroId}/`
      );
      console.log(res.data.data);
      setCuisines(res.data.data);
    } catch (error) {
      console.log("Error fetching cuisines!");
    }
  };

  useEffect(() => {
    fetchCuisine();
  }, []);

  useEffect(() => {
    if (itemData) {
      form.setValue("name", itemData.name || "");
      form.setValue("ingredient", itemData.ingredient);
      form.setValue("discount_price", itemData.item_price.toString());
      form.setValue("price", itemData.actual_price.toString());
      form.setValue("short_description", itemData.short_description);

      const cuisineSelected = cuisines.find(
        (cuisine) =>
          cuisine.name.toLowerCase() === itemData.cuisine[0].name.toLowerCase()
      );
      if (cuisineSelected) {
        console.log("Selected Cuisine:", cuisineSelected);
        setSelectedCuisineId(cuisineSelected.id);
        form.setValue("cuisine_id", cuisineSelected.id);
      }

      setImagePreview(itemData.image);
    }
  }, [itemData, cuisines]);

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
      } else if (key === "cuisine_id") {
        // Check if cuisine_id is already an array, otherwise convert to array
        const cuisineArray = Array.isArray(value) ? value : [value];
        cuisineArray.forEach((id) => {
          formData.append("cuisine_id[]", id?.toString()); // Use `cuisine_id[]` for array in FormData
        });
      } else {
        // Append other values as strings
        formData.append(key, value as string);
      }
    });

    formData.append("restaurant_id", params.restroId);
    formData.append("menu", params.menuId);

    if (itemData) {
      axiosInstance
        .patch(
          `/moreclub/user/food/items/${params.menuId}/${itemData.id}/${params.restroId}/`,
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
          dispatch(clearRestroItem());
          setIsSubmitting(false);
          setImagePreview(null);
        });
    } else {
      axiosInstance
        .post(
          `/moreclub/user/food/items/${params.menuId}/${params.restroId}/`,
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

  return (
    <ScrollArea className="bg-white dark:bg-secondary_dark p-6 h-[88vh]">
      <h1
        className={`text-primary_text dark:text-sidebar_blue text-lg font-medium mb-4 ${open_sans.className}`}
      >
        {itemData ? "Update Food Item for" : "Add Food Item for"} {MenuName}
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="grid sm:grid-cols-2 grid-cols-1 sm:gap-8 gap-4">
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
              name="discount_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount Price</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cuisine_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cuisine</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        const selectedCuisine = cuisines.find(
                          (cuisine) => cuisine.name === value
                        );
                        if (selectedCuisine) {
                          field.onChange(selectedCuisine.id);
                          setSelectedCuisineId(selectedCuisine.id);
                        } else {
                          field.onChange(null);
                          setSelectedCuisineId(null);
                        }
                      }}
                      value={
                        selectedCuisineId
                          ? cuisines.find(
                              (cuisine) => cuisine.id === selectedCuisineId
                            )?.name
                          : ""
                      }
                    >
                      <SelectTrigger className=" h-8">
                        <SelectValue placeholder="Select a cuisine" />
                      </SelectTrigger>
                      <SelectContent>
                        {cuisines.map((cuisine) => (
                          <SelectItem key={cuisine.id} value={cuisine.name}>
                            {cuisine.name}
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
              name="short_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
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
          <Button
            type="submit"
            onClick={() => {
              console.log("Button Clicked!");
              const formValues = form.getValues();
              console.log(formValues);
            }}
            className="bg-primary_text dark:bg-sidebar_blue hover:bg-l_orange dark:hover:bg-blue text-white h-8 mb-6 place-self-start rounded-lg"
          >
            {isSubmitting ? <Loader /> : itemData ? "Edit" : "Add"}
          </Button>
        </form>
      </Form>
    </ScrollArea>
  );
};

export default Page;
