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
import { RootState } from "@/lib/store/store";
import toast from "react-hot-toast";
import Loader from "@/components/ui/Loader";
import useAxiosPrivateSalon from "@/hooks/useAxiosPrivateSalon";
import { clearSalonService } from "@/lib/store/features/salonService/salonServiceSlice";
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
    message: "Service name can't be empty.",
  }),
});

const open_sans = Open_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const CreateService = ({
  params,
}: {
  params: { salonId: string; salonName: string };
}) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { data: session } = useSession();
  const salonName = decodeURIComponent(params.salonName);
  const dispatch = useAppDispatch();
  const axiosInstance = useAxiosPrivateSalon();

  const salonData = useAppSelector((state) => state.service.currentService);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (salonData) {
      form.setValue("name", salonData.name || "");
    }
  }, [salonData]);

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
      // Append other values as strings
      formData.append(key, value as string);
    });

    if (salonData) {
      axiosInstance
        .patch(
          `/moreclub/users/saloons/${params.salonId}/services/${salonData.id}/`,
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
          toast.success("Salon Service Updated Successfully!", {
            duration: 5000,
            position: "top-right",
          });
        })
        .catch((error: any) => {
          console.error("Error submitting form:", error);
          toast.error("Error updating salon service!", {
            duration: 5000,
            position: "top-right",
          });
        })
        .finally(() => {
          dispatch(clearSalonService());
          setIsSubmitting(false);
        });
    } else {
      axiosInstance
        .post(`/moreclub/users/saloons/${params.salonId}/services/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log("Form submitted successfully:", response.data);
          form.reset();
          toast.success("Service Created Successfully!", {
            duration: 5000,
            position: "top-right",
          });
        })
        .catch((error) => {
          console.error("Error submitting form:", error);
          toast.error("Error adding service!", {
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
      <Breadcrumb className="mb-4 -ml-1">
        <BreadcrumbList className="flex sm:gap-1">
          <BreadcrumbItem>
            <BreadcrumbLink
              href={`/salon/${params.salonId}/${params.salonName}/services`}
            >
              <CgArrowLeft
                className="text-primary_text dark:text-sidebar_blue"
                size={25}
              />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbPage className="sm:text-xl text-lg font-medium text-primary_text dark:text-sidebar_blue">
              Add Services for {salonName}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
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
                <FormLabel>Service Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="bg-primary_text dark:bg-sidebar_blue hover:bg-l_orange dark:hover:bg-blue text-white h-8 mb-6 place-self-start rounded-lg"
          >
            {isSubmitting ? <Loader /> : salonData ? "Edit" : "Create"}
          </Button>
        </form>
      </Form>
    </ScrollArea>
  );
};

export default CreateService;
