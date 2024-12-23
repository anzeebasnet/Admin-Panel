"use client";

import { Button } from "@/components/ui/button";
import { useRestroGallery } from "@/lib/react-query/queriesAndMutations";
import { GalleryList } from "@/types/types";
import { Open_Sans } from "next/font/google";
import Image from "next/image";
import React, { useState } from "react";

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
import useAxiosPrivateFood from "@/hooks/useAxiosPrivateFood";
import Loader from "@/components/ui/Loader";
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

const formSchema = z.object({
  id: z.string(),
  images: z.array(z.any()).optional(),
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
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const { data: restroGallery, isLoading: isLoading } = useRestroGallery(
    params.restroId
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { data: session } = useSession();
  const axiosInstance = useAxiosPrivateFood();
  const [deletingImage, setDeletingImage] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      images: undefined,
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
    setIsSubmitting(true);

    Object.entries(values).forEach(([key, value]) => {
      if (key === "images" && Array.isArray(value)) {
        // Append each file as 'images[]' in FormData
        value.forEach((file) => {
          formData.append("images[]", file, file.name);
        });
      } else {
        formData.append(key, value as string);
      }
    });

    formData.append("id", params.restroId);

    axiosInstance
      .post(
        `/moreclub/user/restaurants/gallery/${params.restroId}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        console.log("Added image successfully", response);
        toast.success("Successfully added image!", {
          duration: 5000,
          position: "top-right",
        });
      })
      .catch((error) => {
        console.log("Error adding image", error);
        toast.error("Error adding image!", {
          duration: 5000,
          position: "top-right",
        });
      })
      .finally(() => {
        setIsUploading(false);
        setIsSubmitting(false);
      });
  }

  const DeleteImage = async (imageId: string) => {
    setDeletingImage(true);
    axiosInstance
      .delete(
        `/moreclub/user/restaurants/gallery/${params.restroId}/${imageId}/delete/`
      )
      .then((response) => {
        console.log("Image Deleted", response);
        toast.success("Image Deleted", {
          duration: 5000,
          position: "top-right",
        });
      })
      .catch((error) => {
        console.log("Error Deleting Image!", error);
        toast.error("Error Deleting Image!", {
          duration: 5000,
          position: "top-right",
        });
      })
      .finally(() => {
        setDeletingImage(false);
      });
  };

  return (
    <div
      className={` bg-white dark:bg-secondary_dark rounded-sm p-6 flex flex-col gap-6 shadow-sm shadow-vll_gray dark:shadow-none ${open_sans.className}`}
    >
      <Breadcrumb className="mb-4 -ml-1">
        <BreadcrumbList className="flex sm:gap-1">
          <BreadcrumbItem>
            <BreadcrumbLink
              href={`/restaurant/${params.restroId}/${params.restroName}/gallery`}
            >
              <CgArrowLeft
                className="text-primary_text dark:text-sidebar_blue"
                size={25}
              />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbPage className="sm:text-xl text-sm font-medium text-primary_text dark:text-sidebar_blue">
              Restaurant Gallery
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className=" flex flex-col gap-4">
        {isUploading ? (
          <div className="">
            <h1
              className={`text-primary_text dark:text-sidebar_blue text-lg font-medium mb-4 ${open_sans.className}`}
            >
              Upload Images
            </h1>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Images</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-4">
                          <Input
                            type="file"
                            accept="image/*"
                            multiple // Enable multiple file selection
                            onChange={(e) => {
                              const files = Array.from(e.target.files || []); // Get all selected files
                              field.onChange(files); // Pass an array of files to the form state
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-4">
                  <Button
                    type="submit"
                    className="bg-primary_text dark:bg-sidebar_blue hover:bg-l_orange dark:hover:bg-blue text-white h-8 mb-6 place-self-start rounded-lg"
                  >
                    {isSubmitting ? <Loader /> : "Add Image"}
                  </Button>
                  <Button
                    onClick={() => {
                      setIsUploading(false);
                    }}
                    className="bg-primary_text dark:bg-sidebar_blue hover:bg-l_orange dark:hover:bg-blue text-white h-8 mb-6 place-self-start rounded-lg"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        ) : (
          <div>
            <Button
              onClick={() => {
                setIsUploading(true);
              }}
              className="bg-primary_text dark:bg-sidebar_blue text-white"
            >
              Upload Images
            </Button>
          </div>
        )}
        {isLoading ? (
          <p>Loading Gallery...</p>
        ) : restroGallery && restroGallery.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {restroGallery.map((item: GalleryList) => (
              <div key={item.id} className="relative w-40 h-40">
                <Image
                  src={item.image}
                  alt="image"
                  width={200}
                  height={200}
                  className=""
                />
                <button
                  onClick={() => {
                    DeleteImage(item.id);
                  }}
                  className="absolute top-2 right-2 rounded-full bg-red-500 text-white hover:bg-white hover:text-red-500 p-[6px]"
                >
                  <AiOutlineDelete size={22} />
                </button>
                {deletingImage ? (
                  <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-25 flex justify-center items-center z-50">
                    <div className="bg-white sm:p-8 p-4 rounded shadow-lg lg:w-[30vw] sm:w-[50vw] w-[96vw] flex flex-col gap-2 items-center justify-center">
                      <DialogLoader />
                      <p className="text-black font-normal text-base">
                        Deleting image...
                      </p>
                      <button
                        onClick={() => {
                          setDeletingImage(false);
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
        ) : restroGallery?.length <= 0 ? (
          <p>No images in the gallery. Upload some images!</p>
        ) : (
          <p>Could not load gallery.</p>
        )}
      </div>
    </div>
  );
};

export default Page;
