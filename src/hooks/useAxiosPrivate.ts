"use client";
import { axiosPrivate } from "@/axios/axios";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const useAxiosPrivate = () => {
  const { data: session } = useSession();

  useEffect(() => {
    const requestInterceptor = axiosPrivate.interceptors.request.use(
      (config) => {
        if (session?.user.token) {
          config.headers["Authorization"] = `Bearer ${session.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosPrivate.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle specific response errors if necessary
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestInterceptor);
      axiosPrivate.interceptors.response.eject(responseInterceptor);
    };
  }, [session]);

  return axiosPrivate;
};

export default useAxiosPrivate;
