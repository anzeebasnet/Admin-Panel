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
import Image from "next/image";
import useAxiosPrivateFood from "@/hooks/useAxiosPrivateFood";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CgArrowLeft } from "react-icons/cg";
import Link from "next/link";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import Loader from "@/components/ui/Loader";

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
  const RestroName = decodeURIComponent(params.restroName);
  const dispatch = useAppDispatch();
  const axiosInstance = useAxiosPrivateFood();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      icon: undefined,
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

    axiosInstance
      .post(`/moreclub/user/menus/${params.restroId}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Successfully created menu", response);
        toast.success("Successfully created menu", {
          duration: 5000,
          position: "top-right",
        });
      })
      .catch((error) => {
        console.log("Error creating menu", error);
        toast.error("Error creating menu", {
          duration: 5000,
          position: "top-right",
        });
      })
      .finally(() => {
        setIsSubmitting(false);
        form.reset();
        window.location.href = `/restaurant/${params.restroId}/${params.restroName}/menu/list`;
      });
  }

  return (
    <ScrollArea className="bg-white dark:bg-secondary_dark sm:h-full h-[40vh] relative sm:pt-12 pt-10">
      {/* <Breadcrumb className="mb-4 -ml-1">
        <BreadcrumbList className="flex sm:gap-1">
          <BreadcrumbItem>
            <BreadcrumbLink
              href={`/restaurant/${params.restroId}/${params.restroName}/menu/list`}
            >
              <CgArrowLeft
                className="text-primary_text dark:text-sidebar_blue"
                size={25}
              />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbPage className="sm:text-xl text-sm font-medium text-primary_text dark:text-sidebar_blue">
              Create Menu for {RestroName}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb> */}

      <div className="absolute top-0 left-0 flex w-full">
        <h2 className="sm:text-xl text-sm font-medium text-primary_text dark:text-sidebar_blue">
          Create Menu for {RestroName}
        </h2>
        <Link
          href={`/restaurant/${params.restroId}/${params.restroName}/menu/list`}
          className="absolute top-0 right-0"
        >
          {" "}
          <X />
        </Link>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 "
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
            className="bg-primary_text dark:bg-sidebar_blue hover:bg-l_orange dark:hover:bg-blue text-white h-8 mb-6 place-self-end rounded-lg"
          >
            {isSubmitting ? <Loader /> : "Create Menu"}
          </Button>
        </form>
      </Form>
    </ScrollArea>
  );
};

export default CreateRestroMenu;
