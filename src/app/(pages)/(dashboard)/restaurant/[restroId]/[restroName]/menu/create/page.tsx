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
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Country } from "@/types/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "next-auth/react";
import { Open_Sans } from "next/font/google";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { RootState } from "@/lib/store/store";
import Image from "next/image";
import { clearMenuItem } from "@/lib/store/features/menu/menuSlice";
import toast from "react-hot-toast";
import useAxiosPrivateFood from "@/hooks/useAxiosPrivateFood";
import Loader from "@/components/ui/Loader";
import axios from "axios";
import axiosFood from "@/axios/axiosFood";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "name can't be empty.",
  }),
  icon: z.any().optional(),
});

const open_sans = Open_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const CreateRestroMenu = ({
  params,
}: {
  params: { restroId: string; restroName: string };
}) => {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { data: session } = useSession();
  const StationName = decodeURIComponent(params.restroName);
  const dispatch = useAppDispatch();
  const axiosInstance = useAxiosPrivateFood();

  const menuData = useAppSelector((state: RootState) => state.menu.currentMenu);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      icon: undefined,
    },
  });

  useEffect(() => {
    if (menuData) {
      form.setValue("name", menuData.name || "");
      setLogoPreview(menuData.icon);
    }
  }, [menuData]);

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
      if (key === "icon") {
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

    // if (menuData) {
    //   axiosInstance
    //     .patch(`/moreclub/station/menu/${menuData.id}/update/`, formData, {
    //       headers: {
    //         "Content-Type": "multipart/form-data",
    //       },
    //     })
    //     .then((response) => {
    //       console.log("Form submitted successfully:", response.data);
    //       form.reset();
    //       toast.success("Menu Updated Successfully!", {
    //         duration: 5000,
    //         position: "top-right",
    //       });
    //     })
    //     .catch((error: any) => {
    //       console.error("Error submitting form:", error);
    //       toast.error("Error updating menu!", {
    //         duration: 5000,
    //         position: "top-right",
    //       });
    //     })
    //     .finally(() => {
    //       dispatch(clearMenuItem());
    //       setLogoPreview(null);
    //       setIsSubmitting(false);
    //     });
    // } else {
    //   axiosInstance
    //     .post(`/moreclub/station/${params.restroId}/menu/`, formData, {
    //       headers: {
    //         "Content-Type": "multipart/form-data",
    //       },
    //     })
    //     .then((response) => {
    //       console.log("Form submitted successfully:", response.data);
    //       form.reset();
    //       toast.success("Menu Created Successfully!", {
    //         duration: 5000,
    //         position: "top-right",
    //       });
    //     })
    //     .catch((error) => {
    //       console.error("Error submitting form:", error);
    //       toast.error("Error creating menu!", {
    //         duration: 5000,
    //         position: "top-right",
    //       });
    //     })
    //     .finally(() => {
    //       setLogoPreview(null);
    //       setIsSubmitting(false);
    //     });
    // }

    axios.post(
      `https://api.morefood.se/api/moreclub/user/menus/${params.restroId}/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzMyMDk4NDk3LCJpYXQiOjE3MzIwMTIwOTcsImp0aSI6IjYwNjQ3YzVhYTIwNDQ1OGRiZmU0YmNmMjRkYzFjNjU0IiwidXNlcl9pZCI6IjZmYTk5NDYyLTJkMjgtNDZmZS04MzE2LTg1MGIzYzhjM2Y4YSJ9.EGqNkisEUmmaGOXXnI_dUAYPYA6jhhn6XJvW5rIKxEM"}`,
        },
      }
    );
  }

  return (
    <ScrollArea className="bg-white dark:bg-secondary_dark p-6 h-[88vh]">
      <h1
        className={`text-primary_text dark:text-secondary_text text-lg font-medium mb-4 ${open_sans.className}`}
      >
        Create Menu for {StationName}
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
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
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Icon</FormLabel>
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
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          field.onChange(file); // Set the new file in the form state
                          const fileURL = URL.createObjectURL(file); // Update preview URL
                          setLogoPreview(fileURL); // Update preview
                        }
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
            className="bg-primary_text dark:bg-secondary_text hover:bg-l_orange dark:hover:bg-blue text-white h-8 mb-6 place-self-start rounded-lg"
          >
            {/* {isSubmitting ? <Loader /> : menuData ? "Edit" : "Create"} */}{" "}
            Create
          </Button>
        </form>
      </Form>
    </ScrollArea>
  );
};

export default CreateRestroMenu;