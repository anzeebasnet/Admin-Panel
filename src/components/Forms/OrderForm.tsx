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

interface OrderFormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
}

const StyledFormMessage = styled(FormMessage)`
  color: red;
`;
const formSchema = z.object({
  order_id: z.string(),
  order_status: z.string(),
  order_type: z.string(),
});

const open_sans = Open_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const OrderForm: React.FC<OrderFormProps> = ({ onSubmit }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      order_id: "",
      order_status: "",
      order_type: "",
    },
  });

  const handleOrderIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue("order_id", e.target.value);
    onSubmit(form.getValues());
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(form.getValues());
  };

  return (
    <Form {...form}>
      <form
        className={`grid grid-cols-4 p-4 gap-4 justify-center rounded-sm bg-white dark:bg-primary_dark shadow-sm shadow-vll_gray dark:shadow-none  ${open_sans.className}`}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="order_status"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className=" sm:text-sm text-xs text-textBlue font-semibold">
                Order Status
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cooked">Cooked</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancalled">Cancelled</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="order_type"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className=" sm:text-sm text-xs text-textBlue font-semibold">
                Order Type
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="dine-here">Dine-here</SelectItem>
                  <SelectItem value="packed">Packed</SelectItem>
                  <SelectItem value="delivery">Delivery</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="order_id"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className=" sm:text-sm text-xs text-textBlue font-semibold">
                <div className="flex  ">
                  <h1 className=" sm:text-sm text-xs text-textBlue font-semibold mt-1">
                    Order ID
                  </h1>
                </div>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter order ID"
                  {...field}
                  className=" font-medium outline-none mb-0"
                  onChange={handleOrderIdChange}
                />
              </FormControl>
              <StyledFormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="bg-primary_text dark:bg-btn_blue text-white hover:bg-l_orange  dark:hover:bg-blue rounded w-max h-8 md:self-start self-center px-8 mt-2"
        >
          Filter
        </Button>
      </form>
    </Form>
  );
};
export default OrderForm;
