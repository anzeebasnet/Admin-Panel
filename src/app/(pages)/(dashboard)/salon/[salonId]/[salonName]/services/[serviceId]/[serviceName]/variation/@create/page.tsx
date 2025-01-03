"use client";

import { Button } from "@/components/ui/button";
import { useRestroGallery } from "@/lib/react-query/queriesAndMutations";
import { GalleryList, SalonImage } from "@/types/types";
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
import { X } from "lucide-react";
import Link from "next/link";

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
  removed_images: z.array(z.any()).optional(),
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
  const [currentImages, setCurrentImages] = useState<SalonImage[]>([]);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);
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
      removed_images: undefined,
    },
  });

  useEffect(() => {
    if (salonVariationData) {
      form.setValue("name", salonVariationData.name || "");
      form.setValue("price", salonVariationData.price || "");
      form.setValue("discount_price", salonVariationData.discount_price || "");
      form.setValue("description", salonVariationData.description || "");
      form.setValue("duration", salonVariationData.duration || "");

      setCurrentImages(salonVariationData.images || []); // Set existing images
    }
  }, [salonVariationData]);

  const handleRemoveImage = (imageId: string) => {
    setRemovedImageIds((prev) => [...prev, imageId]); // Add image ID to removed list
    setCurrentImages((prev) => prev.filter((img) => img.id !== imageId)); // Remove from display
  };

  useEffect(() => {
    form.setValue("removed_images", removedImageIds);
  }, [removedImageIds, form]);

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
      } else if (key === "removed_images" && Array.isArray(value)) {
        // Add removed image IDs to FormData
        removedImageIds.forEach((id) =>
          formData.append("removed_images[]", id)
        );
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
          window.location.href = `/salon/${params.salonId}/${params.salonName}/services/${params.serviceId}/${params.serviceName}/variation`;
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
          window.location.href = `/salon/${params.salonId}/${params.salonName}/services/${params.serviceId}/${params.serviceName}/variation`;
        });
    }
  }

  return (
    <ScrollArea className="bg-white dark:bg-secondary_dark sm:h-full h-[70vh] relative sm:pt-14 pt-10">
      {/* <Breadcrumb className="mb-4">
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
              {salonVariationData ? "Edit" : "Create"} Variation
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb> */}
      <div className="absolute top-0 left-0 flex w-full">
        <h2 className="sm:text-xl text-sm font-medium text-primary_text dark:text-sidebar_blue">
          {salonVariationData ? "Edit" : "Create"} Variation
        </h2>
        <Link
          href={`/salon/${params.salonId}/${params.salonName}/services/${params.serviceId}/${params.serviceName}/variation`}
          className="absolute top-0 right-0"
        >
          {" "}
          <X />
        </Link>
      </div>
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
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-4 flex-wrap">
                      {/* Render existing images */}
                      {currentImages.map((image, index) => (
                        <div key={image.id} className="relative">
                          <Image
                            src={image.image}
                            alt="image"
                            width={200}
                            height={200}
                            className="w-40 h-40"
                          />
                          <X
                            className="absolute top-2 right-2 bg-white p-1 rounded-full text-red-500 text-xl cursor-pointer"
                            onClick={() => handleRemoveImage(image.id)}
                          />
                        </div>
                      ))}
                      {/* Render newly uploaded images */}
                      {uploadedImages.map((file, index) => (
                        <div key={index} className="relative">
                          <Image
                            src={URL.createObjectURL(file)}
                            alt="uploaded image"
                            width={200}
                            height={200}
                            className="w-40 h-40"
                          />
                          <X
                            className="absolute top-2 right-2 bg-white p-1 rounded-full text-red-500 text-xl cursor-pointer"
                            onClick={() =>
                              setUploadedImages((prev) =>
                                prev.filter((_, i) => i !== index)
                              )
                            }
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-4">
                      <Input
                        type="file"
                        accept="image/*"
                        multiple // Enable multiple file selection
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []); // Get all selected files
                          setUploadedImages((prev) => [...prev, ...files]); // Add new files to uploaded images
                          field.onChange(files); // Pass an array of files to the form state
                        }}
                      />
                    </div>
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
            className="bg-primary_text dark:bg-sidebar_blue hover:bg-l_orange dark:hover:bg-blue text-white h-8 mb-6 place-self-end rounded-lg"
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
    </ScrollArea>
  );
};

export default Page;
