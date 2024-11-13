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
import { Input } from "@/components/ui/input";

import styled from "styled-components";
import { Button } from "../ui/button";
import { DatePicker } from "../DatePicker/DatePicker";

interface SearchFormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  resetTrigger: boolean;
}

const StyledFormMessage = styled(FormMessage)`
  color: red;
`;
const formSchema = z.object({
  username: z.string(),
  date: z.date(),
  email: z.string(),
});

const BillSearchForm: React.FC<SearchFormProps> = ({
  onSubmit,
  resetTrigger,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      date: new Date(),
      email: "",
    },
  });

  const resetForm = () => {
    form.reset({
      username: "",
      date: new Date(),
      email: "",
    });
  };

  useEffect(() => {
    if (resetTrigger) {
      resetForm();
    }
  }, [resetTrigger]);

  const handleusernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue("username", e.target.value);
    onSubmit(form.getValues());
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(form.getValues());
  };

  return (
    <div className="pt-2 py-4">
      <div className=" sm:px-8 md:flex md:justify-center md:items-center">
        <Form {...form}>
          <form
            className="flex flex-col md:grid md:grid-cols-4 gap-4 justify-center md:items-end"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="col-span-1 flex flex-col">
                  <FormLabel className=" sm:text-sm text-xs text-textBlue font-semibold">
                    <div className="flex  ">
                      <h1 className=" sm:text-sm text-xs text-textBlue font-semibold mt-1">
                        Username
                      </h1>
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter username"
                      {...field}
                      className=" font-medium outline-none mb-0"
                      onChange={handleusernameChange}
                    />
                  </FormControl>
                  <StyledFormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="col-span-1 flex flex-col">
                  <FormLabel className=" sm:text-sm text-xs text-textBlue font-semibold">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="example@gmail.com"
                      {...field}
                      className=" font-medium outline-none mb-0"
                      onChange={handleusernameChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="col-span-1 flex flex-col">
                  <FormLabel className=" sm:text-sm text-xs text-textBlue font-semibold">
                    Date
                  </FormLabel>
                  <FormControl className="w-full">
                    <DatePicker />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="  flex sm:justify-start justify-center sm:ml-4">
              <Button
                type="submit"
                className="bg-primary_text dark:bg-btn_blue hover:bg-l_orange dark:hover:bg-blue text-white rounded w-max h-8 self-center px-8"
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
export default BillSearchForm;
