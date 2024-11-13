"use client";
import { axiosPrivate } from "@/axios/axios";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const useAxiosPrivate = () => {
  const { data: session } = useSession();

  useEffect(() => {
    const requestInterceptor = axiosPrivate.interceptors.request.use(
      (config) => {
        // Ensure correct token reference
        const token = session?.accessToken || session?.user.token;
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        } else {
          console.warn("No token found in session");
        }
        console.log("Request headers:", config.headers); // Debugging line
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosPrivate.interceptors.response.use(
      (response) => response,
      (error) => Promise.reject(error)
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestInterceptor);
      axiosPrivate.interceptors.response.eject(responseInterceptor);
    };
  }, [session]);

  return axiosPrivate;
};

export default useAxiosPrivate;
