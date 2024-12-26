// https://moresaloon-backend.vercel.app/api/moreclub/users/saloons/8747f3e3-3349-493d-8f6a-f257341369fe/services/43e799c3-56fd-4cf2-90a7-78d8c5aa3a8a/variations/

// name: Fall Color
// price: 2500
// discount_price: 2200
// description: This is the fall color variation
// images[]: (binary)
// images[]: (binary)
// duration: 02:30:00

"use client";

import { Button } from "@/components/ui/button";
import { useRestroGallery } from "@/lib/react-query/queriesAndMutations";
import { GalleryList } from "@/types/types";
import { Open_Sans } from "next/font/google";
import Image from "next/image";
import React, { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "next-auth/react";
import axios from "axios";
import { AiOutlineDelete } from "react-icons/ai";
import toast from "react-hot-toast";
import { duration } from "@mui/material";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CgArrowLeft } from "react-icons/cg";
import useAxiosPrivateSalon from "@/hooks/useAxiosPrivateSalon";
import { Textarea } from "@/components/ui/textarea";
import { useAppSelector } from "@/lib/store/hooks";
import Loader from "@/components/ui/Loader";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name can't be empty!",
  }),
  price: z.string().min(2, {
    message: "Price can't be empty!",
  }),
  discount_price: z.string(),
  description: z.string().min(10, {
    message: "Description must be atleast 10 characters!",
  }),
  duration: z.string(),
  images: z.array(z.any()).optional(),
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
    serviceId: string;
    serviceName: string;
  };
}) => {
  const { data: session } = useSession();
  const axiosInstance = useAxiosPrivateSalon();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const salonName = decodeURIComponent(params.salonName);
  const salonVariationData = useAppSelector(
    (state) => state.variation.currentVariation
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: "",
      discount_price: "",
      description: "",
      duration: "",
      images: undefined,
    },
  });

  useEffect(() => {
    if (salonVariationData) {
      form.setValue("name", salonVariationData.name || "");
      form.setValue("price", salonVariationData.price || "");
      form.setValue("discount_price", salonVariationData.discount_price || "");
      form.setValue("description", salonVariationData.description || "");
      form.setValue("duration", salonVariationData.duration || "");

      setLogoPreview(salonVariationData.images[0].image);
    }
  }, [salonVariationData]);

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
      if (key === "images" && Array.isArray(value)) {
        // Append each file as 'images[]' in FormData
        value.forEach((file) => {
          formData.append("images[]", file, file.name);
        });
      } else if (key === "duration") {
        if (typeof value === "string") {
          // Check if the value already includes seconds
          const formattedDuration =
            value.split(":").length === 2 ? `${value}:00` : value;
          formData.append(key, formattedDuration);
        } else {
          console.error("Expected a string for duration but got:", value);
        }
      } else {
        formData.append(key, value as string);
      }
    });

    if (salonVariationData) {
      axiosInstance
        .patch(
          `/moreclub/users/saloons/${params.salonId}/services/${params.serviceId}/variations/${salonVariationData.id}/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((response) => {
          console.log("Variant Updated Successfully", response);
          toast.success("Variant Updated Successfully!", {
            duration: 5000,
            position: "top-right",
          });
        })
        .catch((error) => {
          console.log("Failed to Update Variant", error);
          toast.error("Failed to Update Variant!", {
            duration: 5000,
            position: "top-right",
          });
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    } else {
      axiosInstance
        .post(
          `/moreclub/users/saloons/${params.salonId}/services/${params.serviceId}/variations/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((response) => {
          console.log("Variant Added Successfully", response);
          toast.success("Variant Added Successfully!", {
            duration: 5000,
            position: "top-right",
          });
        })
        .catch((error) => {
          console.log("Failed to Add Variant", error);
          toast.error("Failed to Add Variant!", {
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
    <div
      className={` bg-white dark:bg-secondary_dark rounded-sm p-6 flex flex-col gap-6 shadow-sm shadow-vll_gray dark:shadow-none ${open_sans.className}`}
    >
      <Breadcrumb className="mb-4">
        <BreadcrumbList className="flex sm:gap-1">
          <BreadcrumbItem>
            <BreadcrumbLink
              href={`/salon/${params.salonId}/${params.salonName}/services/${params.serviceId}/${params.serviceName}`}
            >
              <CgArrowLeft
                className="text-primary_text dark:text-sidebar_blue"
                size={25}
              />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbPage className="sm:text-xl text-sm font-medium text-primary_text dark:text-sidebar_blue">
              Create Variation
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="grid sm:grid-cols-2 grid-cols-1 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className=" ">
                  <FormLabel>Variation Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem className=" ">
                  <FormLabel>Duration</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        let input = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                        if (input.length > 4) input = input.slice(0, 4); // Limit to 4 characters

                        let formattedTime = "";
                        if (input.length <= 2) {
                          formattedTime = input;
                        } else {
                          formattedTime =
                            input.slice(0, 2) + ":" + input.slice(2);
                        }

                        field.onChange(formattedTime); // Pass the formatted value to react-hook-form
                      }}
                      maxLength={5} // Optional: Limit input length to "hh:mm"
                      placeholder="hh:mm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className=" ">
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
                <FormItem className=" ">
                  <FormLabel>Discount Price</FormLabel>
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
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-4">
                    {logoPreview && (
                      <Image
                        src={logoPreview}
                        alt="Logo Preview"
                        className="w-16 h-16 object-cover"
                        width={200}
                        height={200}
                      />
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      multiple // Enable multiple file selection
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []); // Get all selected files
                        field.onChange(files); // Pass an array of files to the form state
                        setLogoPreview(
                          files[0] ? URL.createObjectURL(files[0]) : null
                        );
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            onClick={() => {
              console.log("Values: ", form.getValues());
            }}
            className="bg-primary_text dark:bg-sidebar_blue hover:bg-l_orange dark:hover:bg-blue text-white h-8 mb-6 place-self-start rounded-lg"
          >
            {isSubmitting ? (
              <Loader />
            ) : salonVariationData ? (
              "Edit Variation"
            ) : (
              "Add Variation"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Page;
