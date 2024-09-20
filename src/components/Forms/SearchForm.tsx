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
    <div className="pt-2 py-4">
      <div className=" px-8 md:flex md:justify-center md:items-center">
        <Form {...form}>
          <form
            className="flex flex-col md:grid md:grid-cols-5 gap-4 justify-center md:items-end"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="is_otp_verified"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className=" sm:text-sm text-xs text-textBlue font-semibold">
                    OTP Verified
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
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
                <FormItem>
                  <FormLabel className=" sm:text-sm text-xs text-textBlue font-semibold">
                    User Type
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
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
                <FormItem>
                  <FormLabel className=" sm:text-sm text-xs text-textBlue font-semibold">
                    Deleted
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
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
                <FormItem>
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

            <div className="  flex justify-center">
              <Button
                type="submit"
                className="bg-bg_orange rounded w-max h-8 self-center px-8"
              >
                Search
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
export default SearchForm;
