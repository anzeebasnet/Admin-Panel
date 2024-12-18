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
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "next-auth/react";
import { Open_Sans } from "next/font/google";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import Image from "next/image";
import toast from "react-hot-toast";
import useAxiosPrivateFood from "@/hooks/useAxiosPrivateFood";
import Loader from "@/components/ui/Loader";
import { clearCuisineItem } from "@/lib/store/features/cuisine/CuisineSlice";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CgArrowLeft } from "react-icons/cg";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "name can't be empty.",
  }),
  image: z.any().optional(),
  restaurant_id: z.string(),
});

const open_sans = Open_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const CreateCuisine = ({
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

  const cuisineData = useAppSelector((state) => state.cuisine.currentCuisine);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      image: undefined,
      restaurant_id: params.restroId,
    },
  });

  useEffect(() => {
    if (cuisineData) {
      form.setValue("name", cuisineData.name || "");
      setLogoPreview(cuisineData.image);
      form.setValue("restaurant_id", params.restroId);
    }
  }, [cuisineData]);

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

    if (cuisineData) {
      axiosInstance
        .patch(
          `/moreclub/user/cuisines/update/${cuisineData.id}/${params.restroId}/`,
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
          toast.success("Cuisine Updated Successfully!", {
            duration: 5000,
            position: "top-right",
          });
        })
        .catch((error: any) => {
          console.error("Error submitting form:", error);
          toast.error("Error updating cuisine!", {
            duration: 5000,
            position: "top-right",
          });
        })
        .finally(() => {
          dispatch(clearCuisineItem());
          setLogoPreview(null);
          setIsSubmitting(false);
        });
    } else {
      axiosInstance
        .post(`/moreclub/user/cuisines/${params.restroId}/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log("Form submitted successfully:", response.data);
          form.reset();
          toast.success("Cuisine Created Successfully!", {
            duration: 5000,
            position: "top-right",
          });
        })
        .catch((error: any) => {
          console.error("Error submitting form:", error);
          toast.error("Error creating cuisine!", {
            duration: 5000,
            position: "top-right",
          });
        })
        .finally(() => {
          setLogoPreview(null);
          setIsSubmitting(false);
        });
    }
  }

  return (
    <ScrollArea className="bg-white dark:bg-secondary_dark p-6 h-[88vh]">
      <Breadcrumb className="mb-4 -ml-1">
        <BreadcrumbList className="flex sm:gap-1">
          <BreadcrumbItem>
            <BreadcrumbLink
              href={`/restaurant/${params.restroId}/${params.restroName}/cuisines`}
            >
              <CgArrowLeft
                className="text-primary_text dark:text-sidebar_blue"
                size={25}
              />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbPage className="sm:text-xl text-sm font-medium text-primary_text dark:text-sidebar_blue">
              {cuisineData ? "Edit" : "Add"} Cuisine for {RestroName}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
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
            name="image"
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
            className="bg-primary_text dark:bg-sidebar_blue hover:bg-l_orange dark:hover:bg-blue text-white h-8 mb-6 place-self-start rounded-lg"
          >
            {isSubmitting ? <Loader /> : cuisineData ? "Edit" : "Create"}
          </Button>
        </form>
      </Form>
    </ScrollArea>
  );
};

export default CreateCuisine;
