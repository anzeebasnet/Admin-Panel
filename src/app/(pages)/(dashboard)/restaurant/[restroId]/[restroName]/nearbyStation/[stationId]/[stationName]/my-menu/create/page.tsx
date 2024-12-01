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
import { Cuisine, MenuItem, RestroMenuList } from "@/types/types";
import { useMenuListByRestro } from "@/lib/react-query/queriesAndMutations";
import { identity } from "lodash";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "name can't be empty.",
  }),
  retailer_price: z.string(),
  short_description: z.string().min(6, {
    message: "Short Description must be atleast 6 characters",
  }),
  image: z.instanceof(File).optional(),
  ingredient: z.string(),
  restaurant_id: z.string(),
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
    stationId: string;
    stationName: string;
  };
}) => {
  const { data: session } = useSession();
  const axiosInstance = useAxiosPrivateFood();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const nearbyItemData = useAppSelector(
    (state: RootState) => state.nearbyItem.currentNearbyItem
  );
  const { data: menuList } = useMenuListByRestro(params.restroId);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      image: undefined,
      retailer_price: "",
      short_description: "",
      ingredient: "",
      restaurant_id: params.restroId,
      menu_id: "",
    },
  });

  useEffect(() => {
    if (nearbyItemData) {
      form.setValue("name", nearbyItemData.name || "");
      form.setValue("ingredient", nearbyItemData.ingredient);
      form.setValue("retailer_price", nearbyItemData.retailer_price);
      form.setValue("short_description", nearbyItemData.short_description);

      const selectedMenu = menuList?.find(
        (menu: RestroMenuList) =>
          menu.name.toLowerCase() === nearbyItemData.menu.toLowerCase()
      );
      if (selectedMenu) {
        console.log("Selected Menu:", selectedMenu);
        setSelectedMenuId(selectedMenu.id);
        form.setValue("menu_id", selectedMenu.id);
        console.log("menu id", selectedMenuId);
      }
      if (selectedMenuId) {
        console.log("Selected menu id", selectedMenuId);
      }

      setImagePreview(nearbyItemData.image);
    }
  }, [nearbyItemData, menuList]);

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

    formData.append("restaurant_id", params.restroId);

    if (nearbyItemData) {
      axios
        .patch(
          `https://api.morefood.se/api/moreclub/station/${params.stationId}/${params.restroId}/${nearbyItemData.id}/food-items/restro/update/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
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
        });
    } else {
      axios
        .post(
          `https://api.morefood.se/api/moreclub/station/${params.stationId}}/restaurant/${params.restroId}/food-items/restro/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
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
        });
    }
  }

  return (
    <ScrollArea className="bg-white dark:bg-secondary_dark p-6 h-[88vh]">
      <h1
        className={`text-primary_text dark:text-sidebar_blue text-lg font-medium mb-4 ${open_sans.className}`}
      >
        {nearbyItemData ? "Update Menu Item" : "Add Menu Item"}
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
                  <FormLabel>Item Name</FormLabel>
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
            />

            <FormField
              control={form.control}
              name="menu_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Menu</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        const selectedMenuItem = menuList.find(
                          (menuItem: RestroMenuList) => menuItem.name === value
                        );
                        if (selectedMenuItem) {
                          field.onChange(selectedMenuItem.id);
                          setSelectedMenuId(selectedMenuItem.id);
                        } else {
                          field.onChange(null);
                          setSelectedMenuId(null);
                        }
                      }}
                      value={
                        selectedMenuId
                          ? menuList.find(
                              (menuItem: RestroMenuList) =>
                                menuItem.id === selectedMenuId
                            )?.name
                          : ""
                      }
                    >
                      <SelectTrigger className=" h-8">
                        <SelectValue placeholder="Select a menu" />
                      </SelectTrigger>
                      <SelectContent>
                        {menuList?.map((menuItem: RestroMenuList) => (
                          <SelectItem key={menuItem.id} value={menuItem.name}>
                            {menuItem.name}
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
            className="bg-primary_text dark:bg-sidebar_blue hover:bg-l_orange dark:hover:bg-blue text-white h-8 mb-6 place-self-start rounded-lg"
          >
            {isSubmitting ? <Loader /> : nearbyItemData ? "Edit" : "Add"}
          </Button>
        </form>
      </Form>
    </ScrollArea>
  );
};

export default Page;
