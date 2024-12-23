import React, { useEffect, useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

import styled from "styled-components";
import { Button } from "../ui/button";
import { Open_Sans } from "next/font/google";

interface SearchFormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  resetTrigger: boolean;
}

const StyledFormMessage = styled(FormMessage)`
  color: red;
`;
const formSchema = z.object({
  dateJoined: z.string(),
  is_otp_verified: z.string(),
  user_type: z.string(),
  is_deleted: z.string(),
});

const open_sans = Open_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const SearchForm: React.FC<SearchFormProps> = ({ onSubmit, resetTrigger }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dateJoined: "",
      is_otp_verified: "",
      user_type: "",
      is_deleted: "",
    },
  });

  const resetForm = () => {
    form.reset({
      dateJoined: "",
      is_otp_verified: "",
      user_type: "",
      is_deleted: "",
    });
  };

  useEffect(() => {
    if (resetTrigger) {
      resetForm();
    }
  }, [resetTrigger]);

  const handleDateJoinedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue("dateJoined", e.target.value);
    onSubmit(form.getValues());
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(form.getValues());
  };

  return (
    <Form {...form}>
      <form
        className={`grid sm:grid-cols-5 grid-cols-1 gap-4 justify-center rounded-sm bg-white dark:bg-primary_dark shadow-sm shadow-vll_gray dark:shadow-none p-3 ${open_sans.className}`}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="is_otp_verified"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className=" sm:text-sm text-xs text-textBlue font-semibold">
                OTP Verified
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="user_type"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className=" sm:text-sm text-xs text-textBlue font-semibold">
                User Type
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="Normal">Normal</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_deleted"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className=" sm:text-sm text-xs text-textBlue font-semibold">
                Deleted
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dateJoined"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className=" sm:text-sm text-xs text-textBlue font-semibold">
                <div className="flex  ">
                  <h1 className=" sm:text-sm text-xs text-textBlue font-semibold mt-1">
                    Date Joined
                  </h1>
                </div>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter a date"
                  {...field}
                  className=" font-medium outline-none mb-0"
                  onChange={handleDateJoinedChange}
                />
              </FormControl>
              <StyledFormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="bg-primary_text dark:bg-btn_blue text-white hover:bg-l_orange  dark:hover:bg-blue rounded w-max h-8 place-self-center px-8 mt-2"
        >
          Filter
        </Button>
      </form>
    </Form>
  );
};
export default SearchForm;
