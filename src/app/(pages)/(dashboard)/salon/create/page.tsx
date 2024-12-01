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
import { RxCross2 } from "react-icons/rx";
import { clearSalonData } from "@/lib/store/features/salonDetailSlice/salonDetailSlice";
import useAxiosPrivateSalon from "@/hooks/useAxiosPrivateSalon";

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
  email: z.string().email({ message: "Invalid email address" }),
  contact_no: z.string().refine((value: string) => isValidPhoneNumber(value), {
    message: "Invalid phone number!",
  }),
  country: z.string().min(1, {
    message: "Country must be selected",
  }),
  currency: z.string(),
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
  amenities: z.array(z.string()),
});

// const updateFormSchema = z.object({
//   name: z.string().min(2, {
//     message: "name can't be empty.",
//   }),
//   address: z.string().min(2, {
//     message: "Address must be at least 2 characters.",
//   }),
//   min_order: z.string().min(2, {
//     message: "Minimum order can't be empty",
//   }),
//   delivery_time: z.string().min(1, {
//     message: "Delivery Time must be entered",
//   }),
//   email: z.string().email({ message: "Invalid email address" }),
//   contact_no: z.string().refine((value: string) => isValidPhoneNumber(value), {
//     message: "Invalid phone number!",
//   }),
//   country: z.string().min(1, {
//     message: "Country must be selected",
//   }),
//   currency: z.string(),
//   is_delivery: z.boolean(),
//   is_pickup: z.boolean(),
//   is_dine: z.boolean(),
//   lat: z.string(),
//   lng: z.string(),
//   banner: z.any(),
//   logo: z.any(),
//   short_description: z.string().min(2, {
//     message: "Short description must be at least 2 characters.",
//   }),
//   long_description: z.string().min(2, {
//     message: "Long description must be at least 2 characters.",
//   }),
//   website_link: z.string(),
//   facebook_link: z.string(),
//   instagram_link: z.string(),
//   station_no_of_packed_item: z.number().nullable(),
// });

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

const Salon = () => {
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
  const [amenityInput, setAmenityInput] = useState("");

  const dispatch = useAppDispatch();
  const axiosInstance = useAxiosPrivateSalon();

  const salonData = useAppSelector(
    (state: RootState) => state.salon.currentSalon
  );

  const formSchema = createFormSchema;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      email: "",
      contact_no: "",
      country: undefined,
      currency: undefined,
      lat: "",
      lng: "",
      banner: null,
      logo: null,
      short_description: "",
      long_description: "",
      website_link: "",
      facebook_link: "",
      instagram_link: "",
      amenities: [],
    },
  });

  const fetchCountry = async () => {
    try {
      const res = await axiosInstance.get(`/country/list/`);
      console.log(res.data.data);
      setCountries(res.data.data);
    } catch (error) {
      console.log("Error retrieving country list.", error);
    }
  };

  useEffect(() => {
    fetchCountry();

    if (typeof window !== "undefined" && !salonData) {
      // Check if the window object is defined
      const latitude = localStorage.getItem("latitude");
      const longitude = localStorage.getItem("longitude");

      if (latitude) form.setValue("lat", latitude);
      if (longitude) form.setValue("lng", longitude);
    }
  }, []);

  useEffect(() => {
    if (salonData) {
      form.setValue("name", salonData.name);
      form.setValue("address", salonData.address);
      form.setValue("email", salonData.email);
      form.setValue("contact_no", salonData.contact_no);
      form.setValue("lat", salonData.lat.toString());
      form.setValue("lng", salonData.lng.toString());
      form.setValue("short_description", salonData.short_description || "");
      form.setValue("long_description", salonData.long_description || "");
      form.setValue("website_link", salonData.website_link);
      form.setValue("facebook_link", salonData.facebook_link);
      form.setValue("instagram_link", salonData.instagram_link);
      form.setValue("country", salonData.country.toString());
      form.setValue("currency", salonData.currency.toString());

      if (salonData.amenities) {
        form.setValue("amenities", salonData.amenities); // Populate form with amenities
      }

      // Optionally, set state for country and currency if needed
      const selectedCountry = countries.find(
        (country) => country.id === salonData.country
      );
      if (selectedCountry) {
        setSelectedCountryId(selectedCountry.id);
        setCurrency(salonData.currency.toString());
      }

      // Set banner and logo previews if they exist in the Redux store
      if (salonData.banner) {
        setBannerPreview(salonData.banner);
        // form.setValue("banner", salonData.banner); // Set form value
      }

      if (salonData.logo) {
        setLogoPreview(salonData.logo);
        // form.setValue("logo", salonData.logo); // Set form value
      }
    }
  }, [salonData, countries]);

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
          const fileBlob = new Blob([value], { type: value.type });
          formData.append(key, fileBlob, value.name);
        }
      } else if (key === "amenities" && Array.isArray(value)) {
        // Correct way to append each amenity as 'amenities[]'
        value.forEach((amenity) => {
          formData.append("amenities[]", amenity); // No extra argument
        });
      } else {
        formData.append(key, value as string);
      }
    });

    if (salonData) {
      axiosInstance
        .patch(`/moreclub/users/saloon/${salonData.id}/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log("Form submitted successfully:", response.data);
          form.reset();
          toast.success("Salon Updated Successfully!", {
            duration: 5000,
            position: "top-right",
          });
        })
        .catch((error) => {
          console.error("Error submitting form:", error);
          toast.error(`Error updating salon! ${error}`, {
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
          setLogoPreview(null);
          setBannerPreview(null);
          setIsSubmitting(false);
        });
    } else {
      axiosInstance
        .post("/moreclub/saloon/setup/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log("Form submitted successfully:", response.data);
          form.reset();
          toast.success("Salon Created Successfully!", {
            duration: 5000,
            position: "top-right",
          });
        })
        .catch((error) => {
          console.error("Error submitting form:", error);
          toast.error(`Error creating salon! ${error}`, {
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
  }

  const handleAddAmenity = () => {
    const currentAmenities = form.getValues("amenities") || []; // Fallback to empty array
    if (amenityInput.trim()) {
      form.setValue("amenities", [...currentAmenities, amenityInput.trim()]);
      setAmenityInput(""); // Clear input after adding
    }
  };

  const handleRemoveAmenity = (index: number) => {
    const currentAmenities = form.getValues("amenities") || [];
    const updatedAmenities = currentAmenities.filter((_, i) => i !== index);
    form.setValue("amenities", updatedAmenities, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  // Render the list of amenities
  const amenitiesList = form.watch("amenities") || []; // Reactively watch amenities changes

  return (
    <ScrollArea className="bg-white dark:bg-secondary_dark p-6 sm:pr-10 h-[88vh]">
      <h1
        className={`text-primary_text dark:text-sidebar_blue text-lg font-medium mb-4 ${open_sans.className}`}
      >
        {salonData ? "Update Salon" : "Create Salon"}
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className=" flex flex-col gap-6">
            <div className="grid sm:grid-cols-2 grid-cols-1 gap-x-6 gap-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className=" ">
                    <FormLabel>Salon Name</FormLabel>
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
            </div>

            <div className="md:grid md:grid-cols-2 flex flex-col-reverse gap-x-6 gap-y-4 md:mt-2">
              <div>
                <h2 className="font-medium text-sm">Location</h2>
                <MapboxComponent setNewAddress={handleAddressUpdate} />
              </div>
              <div className="flex flex-col md:gap-8 gap-6">
                <div className="">
                  <FormField
                    control={form.control}
                    name="amenities"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amenities</FormLabel>
                        <div className="flex items-center gap-3">
                          <FormControl>
                            <Input
                              {...field}
                              value={amenityInput}
                              onChange={(e) => setAmenityInput(e.target.value)}
                              placeholder="Enter amenity"
                            />
                          </FormControl>
                          <Button
                            type="button"
                            onClick={handleAddAmenity}
                            className="bg-primary_text dark:bg-sidebar_blue px-4 py-0 text-white text-sm rounded-sm"
                          >
                            Add
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <ul className="mt-4 flex gap-4">
                    {amenitiesList.map((amenity, index) => (
                      <li
                        key={index}
                        className="inline-flex gap-2 items-center bg-primary_text dark:bg-sidebar_blue text-white px-2 py-1 rounded-full"
                      >
                        <span className="text-sm text-white">{amenity}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveAmenity(index)}
                          className=" bg-white rounded-full p-1"
                        >
                          <RxCross2 color="red" />
                        </button>
                      </li>
                    ))}
                  </ul>
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
                    <FormLabel>Salon Logo</FormLabel>
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
                    <FormLabel>Salon Banner</FormLabel>
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
              {salonData ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Form>
    </ScrollArea>
  );
};

export default Salon;
