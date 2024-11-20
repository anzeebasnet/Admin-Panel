"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import Loader from "@/components/ui/Loader";

type PasswordVisibility = {
  password: boolean;
};

const formSchema = z.object({
  username: z.string().min(4, {
    message: "Username is required",
  }),
  password: z.string().min(8),
});

const StyledFormMessage = styled(FormMessage)`
  color: red;
`;

export function LogInForm() {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  const [isPasswordVisible, setIsPasswordVisible] =
    useState<PasswordVisibility>({
      password: false,
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    console.log("Submitted the login form...");
    try {
      const response = await signIn("credentials", {
        username: values.username,
        password: values.password,
        redirect: false,
      });

      if (!response || response.error) {
        setIsSubmitting(false);
        toast.error("Failed to Login. Please try again!", {
          duration: 5000,
          position: "top-right",
        });
        console.error("Sign in error:", response?.error || "No response");
        return;
      }

      if (response.ok) {
        toast.success("Successfully logged in!", {
          duration: 5000,
          position: "top-right",
        });
        form.reset();
        setTimeout(() => {
          router.push("/");
        }, 1500);
      }

      return { success: true, response: response };
    } catch (error: any) {
      const errorMessage = error?.cause?.err?.message;
      return { success: false, error: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  }

  const togglePasswordVisibility = (field: keyof PasswordVisibility) => {
    setIsPasswordVisible((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div
      className={
        " sm:w-[45vw] md:w-[45vw] lg:w-[35vw] 2xl:w-[20vw]  px-8 py-4 flex flex-col gap-4 dark:bg-card_dark bg-white rounded-md"
      }
    >
      <h1 className="sm:text-2xl text-xl font-bold text-center">Login</h1>

      <Form {...form}>
        <form
          className="flex flex-col gap-3"
          method="POST"
          action="/auth/login"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit(onSubmit)(e);
          }}
          noValidate
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-textBlue font-medium sm:text-sm text-xs">
                  <div className="flex gap-x-1">
                    <h1 className=" sm:text-sm text-xs text-textBlue font-semibold">
                      Username
                    </h1>
                    <h1 className=" sm:text-sm text-xs text-red-600 font-semibold">
                      *
                    </h1>
                  </div>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Your Email Address"
                    type="text"
                    className="font-medium outline-none pr-10 focus-visible:ring-0  focus-visible:ring-offset-0"
                    {...field}
                  />
                </FormControl>
                <StyledFormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-textBlue font-medium sm:text-sm text-xs">
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
                      placeholder="Confirm Your Password"
                      type={isPasswordVisible.password ? "text" : "password"}
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

          <Button
            type="submit"
            className="bg-primary_text hover:bg-btnBlue/80 w-full mt-2 h-8 self-center rounded-lg"
          >
            {isSubmitting ? <Loader /> : "Sign in"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
