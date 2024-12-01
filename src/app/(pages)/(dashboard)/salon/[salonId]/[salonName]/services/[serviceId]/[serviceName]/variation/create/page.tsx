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
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const { data: restroGallery, isLoading: isLoading } = useRestroGallery(
    params.salonId
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { data: session } = useSession();
  const salonName = decodeURIComponent(params.salonName);
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

    formData.append("id", params.salonId);

    axios.post(
      `/moreclub/users/saloons/${params.salonId}/services/${params.serviceId}/variations/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
        },
      }
    );
  }
  // https://api.morefood.se/api/moreclub/user/restaurants/gallery/a3033826-214a-46d9-a249-b01622ce1419/
  // id: a3033826-214a-46d9-a249-b01622ce1419
  // images[]: (binary)

  const DeleteImage = async (imageId: string) => {
    axios
      .delete(
        `https://api.morefood.se/api/moreclub/user/restaurants/gallery/${params.salonId}/${imageId}/delete/`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
          },
        }
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
      });
  };

  return (
    <div
      className={` bg-white dark:bg-secondary_dark rounded-sm p-6 flex flex-col gap-6 shadow-sm shadow-vll_gray dark:shadow-none ${open_sans.className}`}
    >
      <div className="flex sm:flex-row flex-col sm:justify-between sm:gap-0 gap-4">
        <h1
          className={`text-primary_text dark:text-sidebar_blue text-lg font-semibold ${open_sans.className}`}
        >
          Restaurant Gallery
        </h1>
      </div>

      {isUploading ? (
        <div className="w-96">
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

              <Button
                type="submit"
                onClick={() => {
                  console.log("Values: ", form.getValues());
                }}
                className="bg-primary_text dark:bg-sidebar_blue hover:bg-l_orange dark:hover:bg-blue text-white h-8 mb-6 place-self-start rounded-lg"
              >
                Create Menu
              </Button>
            </form>
          </Form>
        </div>
      ) : (
        <div>
          <Button
            onClick={() => {
              setIsUploading(true);
            }}
            className="bg-primary_text dark:bg-sidebar_blue"
          >
            Upload Gallery
          </Button>
        </div>
      )}

      {isLoading ? (
        <p>Loading Gallery...</p>
      ) : restroGallery && restroGallery.length > 0 ? (
        <div className="flex flex-wrap gap-4">
          {restroGallery.map((item: GalleryList) => (
            <div key={item.id} className="relative">
              <Image
                src={item.image}
                alt="image"
                width={200}
                height={200}
                className="w-40 h-w-40"
              />
              <button
                onClick={() => {
                  DeleteImage(item.id);
                }}
                className="absolute top-2 right-2 rounded-full bg-red-500 p-[6px]"
              >
                <AiOutlineDelete size={22} color="white" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>Could not load gallery.</p>
      )}
    </div>
  );
};

export default Page;
