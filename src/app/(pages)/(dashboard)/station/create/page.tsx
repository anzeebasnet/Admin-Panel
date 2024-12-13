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
import PhoneNumberInput from "@/components/PhoneNumberInput/PhoneNumberInput";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import styled from "styled-components";
import MapboxComponent from "@/components/Mapbox/Mapbox";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { RootState } from "@/lib/store/store";
import Image from "next/image";
import { clearStationData } from "@/lib/store/features/station/stationSlice";
import toast from "react-hot-toast";
import useAxiosPrivateFood from "@/hooks/useAxiosPrivateFood";
import { Textarea } from "@/components/ui/textarea";
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
  country: z.number().positive({
    message: "Please select a country.",
  }),
  currency: z.number(),
  logo: z.any(),
  short_description: z.string().min(2, {
    message: "Short description must be at least 2 characters.",
  }),
  long_description: z.string().min(2, {
    message: "Long description must be at least 2 characters.",
  }),
  email: z.string().email({ message: "Invalid email address" }),
  contact_no: z.string().refine((value: string) => isValidPhoneNumber(value), {
    message: "Invalid phone number!",
  }),
  lat: z.string(),
  lng: z.string(),
  banner: z.any(),
  first_name: z.string().min(2, {
    message: "First Name can't be empty",
  }),
  last_name: z.string().min(2, {
    message: "Last Name can't be empty",
  }),
  phone_number: z
    .string()
    .refine((value: string) => isValidPhoneNumber(value), {
      message: "Invalid phone number!",
    }),
  gender: z.string().min(1, {
    message: "Gender must be selected",
  }),
  username: z.string().min(2, {
    message: "Username must be entered",
  }),
  password: z.string().min(8),
  prefix_code: z
    .string()
    .nullable()
    .refine((value) => value === null || /^\+\d+$/.test(value), {
      message: "Prefix code must start with a '+' followed by digits",
    }),
  moreclub_country_code: z.string(),
  moreclub_country_name: z.string().min(2, {
    message: "Country must be selected",
  }),
  is_new_user: z.boolean(),
});

const updateFormSchema = z.object({
  name: z.string().optional(),
  address: z.string().optional(),
  country: z.number(),
  currency: z.number(),
  logo: z.any().optional(),
  short_description: z.string(),
  long_description: z.string(),
  email: z.string().email({ message: "Invalid email address" }),
  contact_no: z.string().refine((value: string) => isValidPhoneNumber(value), {
    message: "Invalid phone number!",
  }),
  lat: z.string(),
  lng: z.string(),
  banner: z.any().optional(),
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

const Station = () => {
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

  const stationData = useAppSelector(
    (state: RootState) => state.station.currentStation
  );

  const formSchema = stationData ? updateFormSchema : createFormSchema;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: stationData
      ? {
          name: "",
          address: "",
          country: undefined,
          logo: undefined,
          banner: undefined,
          short_description: "",
          long_description: "",
          email: "",
          contact_no: "",
        }
      : {
          name: "",
          address: "",
          country: undefined,
          logo: undefined,
          banner: undefined,
          short_description: "",
          long_description: "",
          email: "",
          contact_no: "",
          first_name: "",
          last_name: "",
          username: "",
          password: "",
          phone_number: "",
          gender: "",
          prefix_code: "",
          is_new_user: true,
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

    if (typeof window !== "undefined" && !stationData) {
      // Check if the window object is defined
      const latitude = localStorage.getItem("latitude");
      const longitude = localStorage.getItem("longitude");

      if (latitude) form.setValue("lat", latitude);
      if (longitude) form.setValue("lng", longitude);
    }
  }, []);

  useEffect(() => {
    if (stationData) {
      form.setValue("name", stationData.name);
      form.setValue("email", stationData.email);
      form.setValue("contact_no", stationData.contact_no);
      form.setValue("short_description", stationData.short_description || "");
      form.setValue("long_description", stationData.long_description || "");
      form.setValue("address", stationData.address);
      form.setValue("lat", stationData.lat.toString());
      form.setValue("lng", stationData.lng.toString());
      form.setValue("country", stationData.country);
      form.setValue("currency", stationData.currency);

      // Optionally, set state for country and currency if needed
      const selectedCountry = countries.find(
        (country) => country.id === stationData.country
      );
      if (selectedCountry) {
        setSelectedCountryId(selectedCountry.id);
        setCurrency(stationData.currency.toString());
      }

      // Set banner and logo previews if they exist in the Redux store
      if (stationData.banner) {
        setBannerPreview(stationData.banner);
        // form.setValue("banner", stationData.banner); // Set form value
      }

      if (stationData.logo) {
        setLogoPreview(stationData.logo);
        // form.setValue("logo", stationData.logo); // Set form value
      }
    }
  }, [stationData, countries]);

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
    // formData.append("is_new_user", true);

    // if (stationData) {
    //   axiosInstance
    //     .patch(`/moreclub/station/${stationData.id}/`, formData, {
    //       headers: {
    //         "Content-Type": "multipart/form-data",
    //       },
    //     })
    //     .then((response) => {
    //       console.log("Form submitted successfully:", response.data);
    //       form.reset();
    //       toast.success("Station Updated Successfully!", {
    //         duration: 5000,
    //         position: "top-right",
    //       });
    //     })
    //     .catch((error) => {
    //       console.error("Error submitting form:", error);
    //       toast.error(`Error updating station! ${error}`, {
    //         duration: 5000,
    //         position: "top-right",
    //       });
    //       if (error.response) {
    //         console.error("Response data:", error.response.data);
    //         console.error("Response status:", error.response.status);
    //       } else if (error.request) {
    //         console.error("Request data:", error.request);
    //       } else {
    //         console.error("Error message:", error.message);
    //       }
    //     })
    //     .finally(() => {
    //       dispatch(clearStationData());
    //       setLogoPreview(null);
    //       setBannerPreview(null);
    //       setIsSubmitting(false);
    //     });
    // } else {
    //   axiosInstance
    //     .post("/moreclub/setup/station/", formData, {
    //       headers: {
    //         "Content-Type": "multipart/form-data",
    //       },
    //     })
    //     .then((response) => {
    //       console.log("Form submitted successfully:", response.data);
    //       form.reset();
    //       toast.success("Station Created Successfully!", {
    //         duration: 5000,
    //         position: "top-right",
    //       });
    //     })
    //     .catch((error) => {
    //       console.error("Error submitting form:", error);
    //       toast.error(`Error creating station! ${error}`, {
    //         duration: 5000,
    //         position: "top-right",
    //       });
    //     })
    //     .finally(() => {
    //       setLogoPreview(null);
    //       setBannerPreview(null);
    //       setIsSubmitting(false);
    //     });
    // }
  }

  const togglePasswordVisibility = (field: keyof PasswordVisibility) => {
    setIsPasswordVisible((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <ScrollArea className="bg-white dark:bg-secondary_dark p-6 h-[88vh]">
      <Breadcrumb className="mb-4 -ml-1">
        <BreadcrumbList className="flex sm:gap-1">
          <BreadcrumbItem>
            <BreadcrumbLink href="/station">
              <CgArrowLeft
                className="text-primary_text dark:text-sidebar_blue"
                size={25}
              />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbPage className="sm:text-xl text-sm font-medium text-primary_text dark:text-sidebar_blue">
              {stationData ? "Update Station" : "Create Station"}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          {!stationData ? (
            <div className="flex flex-col gap-2">
              <h3
                className={`text-primary_text dark:text-sidebar_blue text-base font-medium  ${open_sans.className}`}
              >
                User Information
              </h3>
              <div className="sm:grid sm:grid-cols-2 sm:gap-x-8 flex flex-col gap-y-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="pt-1">
                      <FormLabel>
                        <div className="flex gap-x-1">
                          <h1 className=" sm:text-sm text-xs text-textBlue font-semibold">
                            Password
                          </h1>
                          <h1 className=" sm:text-sm text-xs text-red-600 font-semibold">
                            *
                          </h1>
                        </div>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Enter Your Password"
                            type={
                              isPasswordVisible.password ? "text" : "password"
                            }
                            className="font-medium outline-none pr-10 focus-visible:ring-0  focus-visible:ring-offset-0"
                            {...field}
                          />
                          <div
                            onClick={() => togglePasswordVisibility("password")}
                            className="absolute top-1/2 right-5 transform -translate-y-1/2 "
                          >
                            {isPasswordVisible.password ? (
                              <FaRegEye />
                            ) : (
                              <FaRegEyeSlash />
                            )}
                          </div>
                        </div>
                      </FormControl>
                      <StyledFormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <PhoneNumberInput
                          initialValue={field.value || ""}
                          onChange={(data) => {
                            form.setValue("phone_number", data.phone);
                            form.setValue("prefix_code", data.prefix);
                            form.setValue(
                              "moreclub_country_code",
                              data.countryCode || ""
                            );
                            form.setValue(
                              "moreclub_country_name",
                              data.country || ""
                            );
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ""}
                        >
                          <SelectTrigger className=" h-8">
                            <SelectValue placeholder="Select Gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MALE">MALE</SelectItem>
                            <SelectItem value="FEMALE">FEMALE</SelectItem>
                            <SelectItem value="OTHER">OTHER</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ) : (
            ""
          )}

          <div className="flex flex-col gap-2">
            <h3
              className={`text-primary_text dark:text-sidebar_blue text-base font-medium ${open_sans.className}`}
            >
              Station Information
            </h3>
            <div className="flex flex-col gap-4">
              <div className="grid sm:grid-cols-2 grid-cols-1 gap-x-8 gap-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Station Name</FormLabel>
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
                    <FormItem>
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
                    <FormItem>
                      <FormLabel>Contact No.</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={(value) => {
                                const selectedCountry = countries.find(
                                  (country) => country.name === value
                                );
                                if (selectedCountry) {
                                  field.onChange(selectedCountry.id);
                                  //set currency
                                  form.setValue(
                                    "currency",
                                    selectedCountry.currency.id
                                  );
                                  setCurrency(
                                    selectedCountry.currency.id.toString()
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
                              <SelectTrigger className="w-[180px] h-8">
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
                    /> */}
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            const selectedCountry = countries.find(
                              (country) => country.name === value
                            );
                            if (selectedCountry) {
                              field.onChange(selectedCountry.id);
                              setCurrency(selectedCountry.currency.name); // Update currency display
                              // setSelectedCurrencyId(
                              //   selectedCountry.currency.id
                              // ); // Set currency ID in form
                              form.setValue(
                                "currency",
                                selectedCountry.currency.id
                              ); // Update currency in form
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
                          <SelectTrigger className=" h-8">
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
                {/* <FormField
                      control={form.control}
                      name="currency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Currency</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={(value) => {
                                const currencyId = countries.find(
                                  (country) => country.id === selectedCountryId
                                )?.currency.id;
                                if (currencyId) {
                                  field.onChange(currencyId);
                                  setSelectedCurrencyId(currencyId);
                                } else {
                                  field.onChange(null);
                                }
                              }}
                              value={
                                selectedCurrencyId
                                  ? selectedCurrencyId.toString()
                                  : ""
                              }
                            >
                              <SelectTrigger className="w-[180px] h-8">
                                <SelectValue placeholder="Select currency" />
                              </SelectTrigger>
                              <SelectContent>
                                {selectedCountryId && (
                                  <SelectItem
                                    value={
                                      countries
                                        .find(
                                          (country) =>
                                            country.id === selectedCountryId
                                        )
                                        ?.currency.id?.toString() || ""
                                    }
                                  >
                                    {currency || "Select currency"}
                                  </SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="currency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Currency</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={(value) => {
                                const currencyId = countries.find(
                                  (country) => country.id === selectedCountryId
                                )?.currency.id;
                                if (currencyId) {
                                  field.onChange(currencyId);
                                  setSelectedCurrencyId(currencyId);
                                } else {
                                  field.onChange(null);
                                }
                              }}
                              value={
                                selectedCurrencyId
                                  ? selectedCurrencyId.toString()
                                  : ""
                              }
                            >
                              <SelectTrigger className="w-[180px] h-8">
                                <SelectValue placeholder="Select currency" />
                              </SelectTrigger>
                              <SelectContent>
                                {selectedCountryId && (
                                  <SelectItem
                                    value={
                                      countries
                                        .find(
                                          (country) =>
                                            country.id === selectedCountryId
                                        )
                                        ?.currency.id?.toString() || ""
                                    }
                                  >
                                    {currency || "Select currency"}
                                  </SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    /> */}
              </div>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-x-6 gap-y-4">
                <div>
                  <h2 className="font-medium text-sm">Location</h2>
                  <MapboxComponent setNewAddress={handleAddressUpdate} />
                </div>
                <div className="flex flex-col gap-4 md:mt-4">
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
              </div>
              <div className="grid sm:grid-cols-2 grid-cols-1 gap-x-6 gap-y-4">
                <FormField
                  control={form.control}
                  name="logo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Station Logo</FormLabel>
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
                      <FormLabel>Station Banner</FormLabel>
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
            </div>
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
            {stationData ? "Update" : "Create"}
          </Button>
        </form>
      </Form>
    </ScrollArea>
  );
};

export default Station;
