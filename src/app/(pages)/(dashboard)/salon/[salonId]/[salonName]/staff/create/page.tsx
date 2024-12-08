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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { CountryType, SalonServices } from "@/types/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "next-auth/react";
import { Open_Sans } from "next/font/google";
import styled from "styled-components";
import MapboxComponent from "@/components/Mapbox/Mapbox";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { RootState } from "@/lib/store/store";
import Image from "next/image";
import toast from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";
import { RxCross2 } from "react-icons/rx";
import { clearSalonData } from "@/lib/store/features/salonDetailSlice/salonDetailSlice";
import useAxiosPrivateSalon from "@/hooks/useAxiosPrivateSalon";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CgArrowLeft } from "react-icons/cg";
import { useSalonServices } from "@/lib/react-query/queriesAndMutations";
import { XIcon } from "lucide-react";
import Loader from "@/components/ui/Loader";

const createFormSchema = z.object({
  name: z.string().min(2, {
    message: "name can't be empty.",
  }),
  saloon: z.string(),
  email: z.string().email({ message: "Invalid email address" }),
  contact_no: z.string().refine((value: string) => isValidPhoneNumber(value), {
    message: "Invalid phone number!",
  }),
  image: z.any(),
  buffer_time: z.string().min(2, {
    message: "Buffer Time can't be empty",
  }),
  services: z.array(z.string()),
});

function isValidPhoneNumber(phoneNumber: string): boolean {
  return phoneNumber.replace(/\D/g, "").length >= 10;
}

const StyledFormMessage = styled(FormMessage)`
  color: red;
`;

const Page = ({
  params,
}: {
  params: { salonId: string; salonName: string };
}) => {
  const { data: session } = useSession();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const axiosInstance = useAxiosPrivateSalon();
  const { data: Services } = useSalonServices(params.salonId);

  const salonStaff = useAppSelector(
    (state: RootState) => state.staff.currentStaff
  );

  const formSchema = createFormSchema;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      contact_no: "",
      image: null,
      services: [],
      buffer_time: "00:01:00",
      saloon: "",
    },
  });

  useEffect(() => {
    if (salonStaff) {
      console.log(salonStaff);
      form.setValue("name", salonStaff.name);
      form.setValue("email", salonStaff.email);
      form.setValue("contact_no", salonStaff.contact_no);
      form.setValue("saloon", salonStaff.saloon);

      // Set services as an array of service IDs
      if (salonStaff.services) {
        const serviceIds = salonStaff.services.map((service) => service.id);
        form.setValue("services", serviceIds);
      }

      if (salonStaff.buffer_time) {
        form.setValue("buffer_time", salonStaff.buffer_time); // Update form state
      }

      if (salonStaff.image) {
        setImagePreview(salonStaff.image);
      }
      console.log("Buffer Time: ", form.getValues("buffer_time"));
    }
  }, [salonStaff, form]);

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
          const fileBlob = new Blob([value], { type: value.type });
          formData.append(key, fileBlob, value.name);
        }
      } else if (key === "services" && Array.isArray(value)) {
        value.forEach((service) => {
          formData.append("services[]", service);
        });
      } else {
        formData.append(key, value as string);
      }
    });

    formData.append("saloon", params.salonId);

    if (salonStaff) {
      axiosInstance
        .patch(
          `/moreclub/users/saloons/${params.salonId}/staff/${salonStaff.id}/`,
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
          toast.success("Staff Updated Successfully!", {
            duration: 5000,
            position: "top-right",
          });
        })
        .catch((error) => {
          console.error("Error submitting form:", error);
          toast.error(`Error updating staff data! ${error}`, {
            duration: 5000,
            position: "top-right",
          });
          if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
          } else if (error.request) {
            console.error("Request data:", error.request);
          } else {
            console.error("Error message:", error.message);
          }
        })
        .finally(() => {
          dispatch(clearSalonData());
          setImagePreview(null);
          setIsSubmitting(false);
        });
    } else {
      axiosInstance
        .post(`/moreclub/users/saloons/${params.salonId}/staff/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log("Form submitted successfully:", response.data);
          form.reset();
          toast.success("Staff Added Successfully!", {
            duration: 5000,
            position: "top-right",
          });
        })
        .catch((error) => {
          console.error("Error submitting form:", error);
          toast.error(`Error adding staff! ${error}`, {
            duration: 5000,
            position: "top-right",
          });
        })
        .finally(() => {
          setImagePreview(null);
          setIsSubmitting(false);
        });
    }
  }

  return (
    <ScrollArea className="bg-white dark:bg-secondary_dark p-6 sm:pr-10 h-[88vh]">
      <Breadcrumb className="mb-4">
        <BreadcrumbList className="flex sm:gap-1">
          <BreadcrumbItem>
            <BreadcrumbLink
              href={`/salon/${params.salonId}/${params.salonName}/staff`}
            >
              <CgArrowLeft
                className="text-primary_text dark:text-sidebar_blue"
                size={25}
              />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbPage className="sm:text-xl text-lg font-medium text-primary_text dark:text-sidebar_blue">
              {salonStaff ? `Update ${salonStaff.name}` : "Add Staff"}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 pl-1"
        >
          <div className="grid sm:grid-cols-2 grid-cols-1 gap-x-6 gap-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className=" ">
                  <FormLabel>Staff Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className=" ">
                  <FormLabel>Staff Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact_no"
              render={({ field }) => (
                <FormItem className=" ">
                  <FormLabel>Contact No.</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="buffer_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Buffer Time</FormLabel>
                  <FormControl>
                    <select
                      className="form-select block w-full h-8 border text-sm rounded "
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                    >
                      <option value="">Set Buffer Time</option>
                      <option value="00:01:00">1 min</option>
                      <option value="00:02:00">2 min</option>
                      <option value="00:03:00">3 min</option>
                      <option value="00:04:00">4 min</option>
                      <option value="00:05:00">5 min</option>
                      <option value="00:10:00">10 min</option>
                      <option value="00:15:00">15 min</option>
                      <option value="00:20:00">20 min</option>
                      <option value="00:25:00">25 min</option>
                      <option value="00:30:00">30 min</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="services"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Services</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-2">
                      {/* Selected services as chips */}
                      <div className="flex flex-wrap gap-2">
                        {field.value.map((serviceId: string) => {
                          const selectedService = Services?.find(
                            (service: SalonServices) => service.id === serviceId
                          );
                          return (
                            <div
                              key={serviceId}
                              className="inline-flex gap-2 items-center bg-primary_text dark:bg-sidebar_blue text-white px-2 py-1 rounded-full"
                            >
                              <span className="text-sm text-white">
                                {selectedService?.name}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  field.onChange(
                                    field.value.filter(
                                      (id: string) => id !== serviceId
                                    )
                                  );
                                }}
                                className=" bg-white rounded-full p-1"
                              >
                                <RxCross2 color="red" />
                              </button>
                            </div>
                          );
                        })}
                      </div>

                      {/* Dropdown to select services */}
                      <Select
                        onValueChange={(value) => {
                          const selectedService = Services?.find(
                            (service: SalonServices) => service.id === value
                          );
                          if (selectedService) {
                            // Add the service ID if not already selected
                            if (!field.value.includes(selectedService.id)) {
                              field.onChange([
                                ...field.value,
                                selectedService.id,
                              ]);
                            }
                          }
                        }}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent>
                          {Services?.filter(
                            (service: SalonServices) =>
                              !field.value.includes(service.id)
                          ).map((service: SalonServices) => (
                            <SelectItem key={service.id} value={service.id}>
                              {service.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
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
            onClick={() => {
              console.log("Button Clicked!");
              const formValues = form.getValues();
              console.log(formValues);
            }}
            className="bg-primary_text dark:bg-sidebar_blue hover:bg-l_orange dark:hover:bg-blue text-white h-8 mb-6 mt-4 place-self-start rounded-lg"
          >
            {isSubmitting ? <Loader /> : salonStaff ? "Update" : "Create"}
          </Button>
        </form>
      </Form>
    </ScrollArea>
  );
};

export default Page;
