"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
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
import Link from "next/link";
import React, { useEffect, useState } from "react";
// import { useLogin, useReferrals } from "@/lib/react-query/queriesAndMutations";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa6";
// import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signIn, SignInResponse, useSession } from "next-auth/react";
// import { LoginResponse } from "@/types/types";
import axios from "axios";
import { Loader } from "lucide-react";
import { LoginResponse } from "../../../../types/types";

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

  const { data: session, status } = useSession();

  //   const { mutateAsync: signIn, isPending: isSigning } = useLogin();
  const [isPasswordVisible, setIsPasswordVisible] =
    useState<PasswordVisibility>({
      password: false,
    });

  const form = useForm<z.infer<typeof formSchema>>({
    // resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await signIn("credentials", {
        username: values.username,
        password: values.password,
        redirect: false,
      });

      if (!response) {
        console.log("error in sign in", response);
        throw new Error("Invalid credentials");
      }

      return { success: true, response: response };
    } catch (error: any) {
      const errorMessage = error?.cause?.err?.message;
      return { success: false, error: errorMessage };
    }

    // try {
    //   //   console.log("Submitting login form...");
    //   //   const startTime = performance.now();

    //   console.log(res);

    //   //   const endTime = performance.now();
    //   //   console.log(`Login response time: ${endTime - startTime} ms`);

    //   if (res?.data.success) {
    //     toast.success("Logged in successfully!", {
    //       duration: 5000,
    //       position: "top-right",
    //     });
    //     console.log("Login successful");
    //   } else {
    //     toast.error("Failed to login!", {
    //       duration: 5000,
    //       position: "top-right",
    //     });
    //   }
    //   console.log(session)
    //   console.log(status);

    //   form.reset();
    // } catch (error) {
    //   toast.error(
    //     "Something went wrong! Please try again with correct credentials.",
    //     {
    //       duration: 5000,
    //       position: "top-right",
    //     }
    //   );
    //   console.log(error);
    // }
  }

  const togglePasswordVisibility = (field: keyof PasswordVisibility) => {
    setIsPasswordVisible((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div
      className={
        " sm:w-[45vw] md:w-[45vw] lg:w-[35vw] 2xl:w-[20vw]  px-8 py-4 flex flex-col gap-4 dark:bg-dark_gray bg-white rounded-md"
      }
    >
      <h1 className="sm:text-3xl text-2xl font-bold">Login</h1>

      <Form {...form}>
        <form
          className="flex flex-col gap-3"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-textBlue font-medium sm:text-sm text-xs">
                  <div className="flex gap-x-1">
                    <h1 className=" sm:text-sm text-xs text-textBlue font-semibold">
                      Email
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
            className="bg-bg_orange hover:bg-btnBlue/80 w-full sm:h-12 h-8 self-center rounded-lg"
          >
            {/* {isSigning ? <Loader /> : "Sign in"} */}
            Sign In
          </Button>
        </form>
      </Form>
    </div>
  );
}
