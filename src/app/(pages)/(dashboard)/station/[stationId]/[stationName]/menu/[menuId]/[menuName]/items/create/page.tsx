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
import { useState } from "react";
import { axiosPrivate } from "@/axios/axios";
import { Country } from "@/types/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "next-auth/react";
import { Open_Sans } from "next/font/google";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { RootState } from "@/lib/store/store";

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
  const { data: session } = useSession();
  const dispatch = useAppDispatch();

  const itemData = useAppSelector(
    (state: RootState) => state.foodItem.currentFoodItems
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      image: undefined,
      price: "",
      retailer_price: "",
      offerPrice: "",
      short_description: "",
      is_active: false,
      ingredient: "",
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

    axiosPrivate
      .post(
        `https://api.morefood.se/api/moreclub/station/${params.stationId}/${params.menuId}/food-items/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${
              session?.accessToken || session?.user?.token
            }`,
          },
        }
      )
      .then((response) => {
        console.log("Form submitted successfully:", response.data);
        form.reset(); // Clear form after successful submission
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
      });
  }

  // https://api.morefood.se/api/moreclub/station/:station_id/:menu_id/food-items/

  return (
    <ScrollArea className="bg-white dark:bg-secondary_dark p-6 h-[88vh]">
      <h1
        className={`text-primary_text dark:text-secondary_text text-lg font-medium mb-4 ${open_sans.className}`}
      >
        Add food items for {params.menuName}
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
                        defaultValue={field.value ? "true" : "false"} // Set initial value
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">True</SelectItem>
                          <SelectItem value="false">False</SelectItem>
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
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          field.onChange(file);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Button
            type="submit"
            className="bg-primary_text dark:bg-secondary_text hover:bg-l_orange dark:hover:bg-blue text-white h-8 mb-6 place-self-start rounded-lg"
          >
            Add
          </Button>
        </form>
      </Form>
    </ScrollArea>
  );
};

export default Page;
