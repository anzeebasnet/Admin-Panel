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
import axios from "@/axios/axios";
import { CountryType } from "@/types/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "next-auth/react";
import { Open_Sans } from "next/font/google";
import styled from "styled-components";
import MapboxComponent from "@/components/Mapbox/Mapbox";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { RootState } from "@/lib/store/store";
import Image from "next/image";
import toast from "react-hot-toast";
import useAxiosPrivateFood from "@/hooks/useAxiosPrivateFood";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { clearRestroData } from "@/lib/store/features/restaurant/restaurantSlice";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CgArrowLeft } from "react-icons/cg";

type PasswordVisibility = {
  password: boolean;
};

const createFormSchema = z.object({
  name: z.string().min(2, {
    message: "name can't be empty.",
  }),
  address: z.string().min(2, {
    message: "Address must be at least 2 characters.",
  }),
  min_order: z.string().min(2, {
    message: "Minimum order can't be empty",
  }),
  delivery_time: z.string().min(1, {
    message: "Delivery Time must be entered",
  }),
  email: z.string().email({ message: "Invalid email address" }),
  contact_no: z.string().refine((value: string) => isValidPhoneNumber(value), {
    message: "Invalid phone number!",
  }),
  country: z.string().min(1, {
    message: "Country must be selected",
  }),
  currency: z.string(),
  is_delivery: z.boolean(),
  is_pickup: z.boolean(),
  is_dine: z.boolean(),
  lat: z.string(),
  lng: z.string(),
  banner: z.any(),
  logo: z.any(),
  short_description: z.string().min(2, {
    message: "Short description must be at least 2 characters.",
  }),
  long_description: z.string().min(2, {
    message: "Long description must be at least 2 characters.",
  }),
  website_link: z.string(),
  facebook_link: z.string(),
  instagram_link: z.string(),
  station_no_of_packed_item: z.number().nullable(),
});

const updateFormSchema = z.object({
  name: z.string().min(2, {
    message: "name can't be empty.",
  }),
  address: z.string().min(2, {
    message: "Address must be at least 2 characters.",
  }),
  min_order: z.string().min(2, {
    message: "Minimum order can't be empty",
  }),
  delivery_time: z.string().min(1, {
    message: "Delivery Time must be entered",
  }),
  email: z.string().email({ message: "Invalid email address" }),
  contact_no: z.string().refine((value: string) => isValidPhoneNumber(value), {
    message: "Invalid phone number!",
  }),
  country: z.string().min(1, {
    message: "Country must be selected",
  }),
  currency: z.string(),
  is_delivery: z.boolean(),
  is_pickup: z.boolean(),
  is_dine: z.boolean(),
  lat: z.string(),
  lng: z.string(),
  banner: z.any(),
  logo: z.any(),
  short_description: z.string().min(2, {
    message: "Short description must be at least 2 characters.",
  }),
  long_description: z.string().min(2, {
    message: "Long description must be at least 2 characters.",
  }),
  website_link: z.string(),
  facebook_link: z.string(),
  instagram_link: z.string(),
  station_no_of_packed_item: z.number().nullable(),
});

function isValidPhoneNumber(phoneNumber: string): boolean {
  return phoneNumber.replace(/\D/g, "").length >= 10;
}

const open_sans = Open_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const StyledFormMessage = styled(FormMessage)`
  color: red;
`;

const Restaurant = () => {
  const { data: session } = useSession();
  const [countries, setCountries] = useState<CountryType[]>([]);
  const [address, setAddress] = useState<string>("");
  const [currency, setCurrency] = useState<string>("");
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(
    null
  );
  const [selectedCurrencyId, setSelectedCurrencyId] = useState<number | null>(
    null
  );
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] =
    useState<PasswordVisibility>({
      password: false,
    });

  const dispatch = useAppDispatch();
  const axiosInstance = useAxiosPrivateFood();

  const restroData = useAppSelector(
    (state: RootState) => state.restaurant.currentRestro
  );

  const formSchema = restroData ? updateFormSchema : createFormSchema;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      min_order: "",
      delivery_time: "15 min",
      email: "",
      contact_no: "",
      country: undefined,
      currency: undefined,
      is_delivery: false,
      is_pickup: false,
      is_dine: false,
      lat: "",
      lng: "",
      banner: null,
      logo: null,
      short_description: "",
      long_description: "",
      website_link: "",
      facebook_link: "",
      instagram_link: "",
      station_no_of_packed_item: 0,
    },
  });

  const fetchCountry = async () => {
    try {
      const res = await axios.get(`https://api.morefood.se/api/country/list/`);
      console.log(res.data.data);
      setCountries(res.data.data);
    } catch (error) {
      console.log("Error retrieving country list.", error);
    }
  };

  useEffect(() => {
    fetchCountry();

    if (typeof window !== "undefined" && !restroData) {
      // Check if the window object is defined
      const latitude = localStorage.getItem("latitude");
      const longitude = localStorage.getItem("longitude");

      if (latitude) form.setValue("lat", latitude);
      if (longitude) form.setValue("lng", longitude);
    }
  }, []);

  useEffect(() => {
    if (restroData) {
      form.setValue("name", restroData.name);
      form.setValue("address", restroData.address);
      form.setValue("min_order", restroData.min_order.toString());
      form.setValue("delivery_time", restroData.delivery_time);
      form.setValue("email", restroData.email);
      form.setValue("contact_no", restroData.contact_no);
      form.setValue("lat", restroData.lat.toString());
      form.setValue("lng", restroData.lng.toString());
      form.setValue("short_description", restroData.short_description || "");
      form.setValue("long_description", restroData.long_description || "");
      form.setValue("website_link", restroData.website_link);
      form.setValue("facebook_link", restroData.facebook_link);
      form.setValue("instagram_link", restroData.instagram_link);
      form.setValue("country", restroData.country.toString());
      form.setValue("currency", restroData.currency.toString());
      form.setValue(
        "station_no_of_packed_item",
        restroData.station_no_of_packed_item
      );
      form.setValue("is_delivery", restroData.is_delivery);
      form.setValue("is_dine", restroData.is_dine);
      form.setValue("is_pickup", restroData.is_pickup);

      // Optionally, set state for country and currency if needed
      const selectedCountry = countries.find(
        (country) => country.id === restroData.country
      );
      if (selectedCountry) {
        setSelectedCountryId(selectedCountry.id);
        setCurrency(restroData.currency.toString());
      }

      // Set banner and logo previews if they exist in the Redux store
      if (restroData.banner) {
        setBannerPreview(restroData.banner);
        // form.setValue("banner", restroData.banner); // Set form value
      }

      if (restroData.logo) {
        setLogoPreview(restroData.logo);
        // form.setValue("logo", restroData.logo); // Set form value
      }
    }
  }, [restroData, countries]);

  // Function to handle address update from MapboxComponent
  const handleAddressUpdate = (newAddress: string) => {
    setAddress(newAddress); // Update state with new address from Mapbox
    form.setValue("address", newAddress); // Update the form's "address" field
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!session) {
      console.error("Session not available. Cannot submit.");
      return;
    }
    console.log(values);
    // Create a new FormData instance
    const formData = new FormData();
    setIsSubmitting(true);

    if (selectedCountryId) {
      formData.append("country_id", selectedCountryId.toString());
    }
    if (selectedCurrencyId) {
      formData.append("currency_id", selectedCurrencyId.toString());
    }

    Object.entries(values).forEach(([key, value]) => {
      if (key === "logo" || key === "banner") {
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

    if (restroData) {
      axiosInstance
        .patch(`/moreclub/user/restaurants/${restroData.id}/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log("Form submitted successfully:", response.data);
          form.reset();
          toast.success("Station Updated Successfully!", {
            duration: 5000,
            position: "top-right",
          });
        })
        .catch((error) => {
          console.error("Error submitting form:", error);
          toast.error(`Error updating station! ${error}`, {
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
          dispatch(clearRestroData());
          setLogoPreview(null);
          setBannerPreview(null);
          setIsSubmitting(false);
        });
    } else {
      axiosInstance
        .post("/moreclub/restaurant/setup/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log("Form submitted successfully:", response.data);
          form.reset();
          toast.success("Restaurant Created Successfully!", {
            duration: 5000,
            position: "top-right",
          });
        })
        .catch((error) => {
          console.error("Error submitting form:", error);
          toast.error(`Error creating Restaurant! ${error}`, {
            duration: 5000,
            position: "top-right",
          });
        })
        .finally(() => {
          setLogoPreview(null);
          setBannerPreview(null);
          setIsSubmitting(false);
        });
    }

    // ${morefoodURL}moreclub/user/restaurants/${data.id}/

    // axios
    //   .post(
    //     "https://api.morefood.se/api/moreclub/restaurant/setup/",
    //     formData,
    //     {
    //       headers: {
    //         "Content-Type": "multipart/form-data",
    //         Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzMxNzQ2NTA5LCJpYXQiOjE3MzE2NjAxMDksImp0aSI6ImRlMDc2MDMwYzI5YzQ0ZmJiZmUyMWVlYTgyNTE1ZWRhIiwidXNlcl9pZCI6IjZmYTk5NDYyLTJkMjgtNDZmZS04MzE2LTg1MGIzYzhjM2Y4YSJ9.XUeJSxZQiSUkT7I3AZnr5VWoq_8vG_FAcDQcEapAHnU"}`,
    //       },
    //     }
    //   )
  }

  return (
    <ScrollArea className="bg-white dark:bg-secondary_dark p-6 sm:pr-10 h-[88vh]">
      <Breadcrumb className="mb-4 -ml-1">
        <BreadcrumbList className="flex sm:gap-1">
          <BreadcrumbItem>
            <BreadcrumbLink href={`/restaurant`}>
              <CgArrowLeft
                className="text-primary_text dark:text-sidebar_blue"
                size={25}
              />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbPage className="sm:text-xl text-sm font-medium text-primary_text dark:text-sidebar_blue">
              {restroData ? "Update Restaurant" : "Add Restaurant"}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className=" flex flex-col gap-6">
            <div className="grid xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-x-6 gap-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className=" ">
                    <FormLabel>Restaurant Name</FormLabel>
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
                    <FormLabel>Email</FormLabel>
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
                name="country"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          const selectedCountry = countries.find(
                            (country) => country.name === value
                          );
                          if (selectedCountry) {
                            // Set country ID and currency ID as strings
                            field.onChange(String(selectedCountry.id));
                            setCurrency(selectedCountry.currency.name); // Update currency display
                            form.setValue(
                              "currency",
                              String(selectedCountry.currency.id) // Ensure currency ID is a string
                            );
                            setSelectedCountryId(selectedCountry.id);
                          } else {
                            field.onChange(null);
                          }
                        }}
                        value={
                          selectedCountryId
                            ? countries.find(
                                (country) => country.id === selectedCountryId
                              )?.name
                            : ""
                        }
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Select a country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country.id} value={country.name}>
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="min_order"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>Minimum Order</FormLabel>
                      <div className="relative">
                        <FormControl className="flex">
                          <Input {...field} className="pl-10" />
                        </FormControl>
                        <div className="absolute left-0 top-0 w-8 h-8 bg-vll_gray dark:bg-dark_blue flex items-center justify-center text-sm rounded-l-sm">
                          Rs
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="station_no_of_packed_item"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Station Package</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(
                              value === "" ? "" : parseInt(value, 10)
                            ); // Convert to number or keep as empty string
                          }}
                          value={
                            field.value === null ? "" : field.value.toString()
                          } // Display as string in the input
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="delivery_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Delivery Time</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="md:grid md:grid-cols-2 flex flex-col-reverse gap-x-6 gap-y-4 md:mt-2">
              <div>
                <h2 className="font-medium text-sm">Location</h2>
                <MapboxComponent setNewAddress={handleAddressUpdate} />
              </div>
              <div className="flex flex-col md:gap-8 gap-6">
                <div className="flex gap-2 md:mt-8">
                  <FormField
                    control={form.control}
                    name="is_delivery"
                    render={({ field }) => (
                      <FormItem className="flex items-end space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value || false} // Ensures false is sent when unchecked
                            onCheckedChange={(checked: any) =>
                              field.onChange(checked)
                            }
                          />
                        </FormControl>
                        <FormLabel>Delivery</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="is_pickup"
                    render={({ field }) => (
                      <FormItem className="flex items-end space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value || false} // Ensures false is sent when unchecked
                            onCheckedChange={(checked: any) =>
                              field.onChange(checked)
                            }
                          />
                        </FormControl>
                        <FormLabel>Pick up</FormLabel>
                      </FormItem>
                    )}
                  />{" "}
                  <FormField
                    control={form.control}
                    name="is_dine"
                    render={({ field }) => (
                      <FormItem className="flex items-end space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value || false} // Ensures false is sent when unchecked
                            onCheckedChange={(checked: any) =>
                              field.onChange(checked)
                            }
                          />
                        </FormControl>
                        <FormLabel>Dine-in</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col">
                  <h2
                    className={`text-primary_text dark:text-sidebar_blue text-base font-medium mb-4 ${open_sans.className}`}
                  >
                    Social Media Links
                  </h2>
                  <div className="flex flex-col gap-4">
                    <FormField
                      control={form.control}
                      name="website_link"
                      render={({ field }) => (
                        <FormItem className=" ">
                          <FormLabel>Website Link</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="facebook_link"
                      render={({ field }) => (
                        <FormItem className=" ">
                          <FormLabel>Facebook Link</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="instagram_link"
                      render={({ field }) => (
                        <FormItem className=" ">
                          <FormLabel>Instagram Link</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="short_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="long_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Long Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="md:grid grid-cols-2 flex flex-wrap gap-6">
              <FormField
                control={form.control}
                name="logo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Restaurant Logo</FormLabel>
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
              <FormField
                control={form.control}
                name="banner"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Restaurant Banner</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        {/* Display current banner if available */}
                        {bannerPreview && (
                          <Image
                            src={bannerPreview}
                            alt="Banner Preview"
                            className="w-32 h-16 object-cover"
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
                              setBannerPreview(fileURL); // Update preview
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
              className="bg-primary_text dark:bg-sidebar_blue hover:bg-l_orange dark:hover:bg-blue text-white h-8 mb-6 place-self-start rounded-lg"
            >
              {restroData ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Form>
    </ScrollArea>
  );
};

export default Restaurant;
