"use client";
import React from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { RiCloseCircleFill } from "react-icons/ri";
import styled from "styled-components";

interface AddBusinessProps {
  onClose: () => void;
  heading: string;
}

const formSchema = z.object({
  businessType: z.string().min(3, {
    message: "Business Type must be entered!",
  }),
});

const StyledFormMessage = styled(FormMessage)`
  color: red;
`;

const AddBusiness: React.FC<AddBusinessProps> = ({ onClose, heading }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessType: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {}

  return (
    <div className=" flex flex-col gap-y-3">
      <div className="flex justify-between">
        <h1 className="text-primary_text dark:text-white sm:text-xl text-lg font-normal">
          {heading}
        </h1>
        <button className="justify-self-end" onClick={onClose}>
          <RiCloseCircleFill size={25} />
        </button>
      </div>
      <Form {...form}>
        <form
          className="sm:mt-6 mt-2 flex flex-col gap-y-2"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex flex-col sm:gap-y-5 gap-y-2">
            <FormField
              control={form.control}
              name="businessType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className=" sm:text-sm text-xs text-textBlue font-semibold">
                    <div className="flex gap-x-1">
                      <h1 className=" sm:text-sm text-xs text-textBlue font-semibold">
                        Business Type
                      </h1>
                      <h1 className=" sm:text-sm text-xs text-red-600 font-semibold">
                        *
                      </h1>
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Business Type"
                      {...field}
                      className=" font-medium outline-none"
                    />
                  </FormControl>
                  <StyledFormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="bg-primary_text text-white hover:text-black"
            >
              Add
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddBusiness;
