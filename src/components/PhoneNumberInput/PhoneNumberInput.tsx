import React, { useState, useEffect } from "react";
import axios from "@/axios/axios"; // Make sure it points to your axios instance
import { Country } from "@/types/types";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
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

interface PhoneNumberInputProps {
  onChange: (value: {
    fullNumber: string;
    prefix: string | null;
    phone: string;
    country: string | undefined;
    countryCode: string | undefined;
  }) => void;
  initialValue?: string;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  onChange,
  initialValue = "",
}) => {
  const [phoneNumber, setPhoneNumber] = useState(initialValue);
  const [countryList, setCountryList] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [prefix, setPrefix] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const res = await axios.get(`/country/list/`);
        setCountryList(res.data.data); // Store the complete country data
      } catch (error) {
        console.error("Error retrieving country list.", error);
      }
    };
    fetchCountry();
  }, []);

  useEffect(() => {
    if (countryList.length > 0 && phoneNumber === "") {
      setSelectedCountry(countryList[0]);
      setPrefix(countryList[0].prefix_number);
      setPhoneNumber(`${countryList[0].prefix_number}`);
    } else if (countryList.length > 0 && phoneNumber !== "") {
      const countryPrefix = getCountryPrefix(phoneNumber, countryList);
      if (countryPrefix) {
        setPrefix(countryPrefix);
        const country = countryList.find(
          (country) => country.prefix_number === countryPrefix
        );
        setSelectedCountry(country || null);
      }
    }
  }, [countryList, phoneNumber]);

  const validatePhoneNumber = (phoneNumber: string) => {
    const phoneRegex = /^\+?[1-9]/;
    if (!phoneNumber) return "Phone number is required";
    if (!phoneRegex.test(phoneNumber)) return "Invalid phone number";
    return null;
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhoneNumber = e.target.value;
    const validationError = validatePhoneNumber(newPhoneNumber);
    setError(validationError || "");
    setPhoneNumber(newPhoneNumber);

    const countryPrefix = getCountryPrefix(newPhoneNumber, countryList);
    if (countryPrefix) {
      setPrefix(countryPrefix);
      const country = countryList.find(
        (country) => country.prefix_number === countryPrefix
      );
      setSelectedCountry(country || null);
      onChange({
        fullNumber: newPhoneNumber,
        prefix: countryPrefix,
        phone: newPhoneNumber.replace(`+${countryPrefix}`, ""),
        country: country?.name || "",
        countryCode: country?.code || "",
      });
    } else {
      setError("Invalid country code");
      onChange({
        fullNumber: newPhoneNumber,
        prefix: null,
        phone: newPhoneNumber,
        country: "",
        countryCode: "",
      });
      setPrefix("");
      setSelectedCountry(null);
    }
  };

  const handleCountryChange = (countryCode: string) => {
    const selectedCountry = countryList.find(
      (country) => country.code === countryCode
    );
    if (selectedCountry) {
      setSelectedCountry(selectedCountry);
      setPrefix(selectedCountry.prefix_number);
      setPhoneNumber(`${selectedCountry.prefix_number}`);
    }
  };

  const getCountryPrefix = (phoneNumber: string, countryList: Country[]) => {
    for (const country of countryList) {
      if (phoneNumber.startsWith(`${country.prefix_number}`)) {
        return country.prefix_number;
      }
    }
    return null;
  };

  return (
    <FormItem>
      <FormLabel>Phone Number</FormLabel>
      <div className="flex gap-2">
        <FormField
          name="prefix_code"
          render={() => (
            <FormControl>
              <Select
                onValueChange={handleCountryChange}
                value={selectedCountry?.code || ""}
              >
                <SelectTrigger className="w-[100px] h-8 pl-0">
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  {countryList.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.prefix_number} ({country.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
          )}
        />

        <FormField
          name="phone_number"
          render={({ field }) => (
            <FormControl>
              <Input
                type="text"
                placeholder="Enter phone number"
                value={phoneNumber}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  handlePhoneNumberChange(e);
                }}
              />
            </FormControl>
          )}
        />
      </div>
      {error && <FormMessage>{error}</FormMessage>}
    </FormItem>
  );
};

export default PhoneNumberInput;
