"use client";
import { axiosPrivateFood } from "@/axios/axiosFood";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const useAxiosPrivateFood = () => {
  const { data: session } = useSession();

  useEffect(() => {

    if (!session) return;
    
    const requestInterceptor = axiosPrivateFood.interceptors.request.use(
      (config) => {
        // Ensure correct token reference
        const token = session?.accessToken || session?.user.token;
        console.log("Session Access Token:", token); 
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        } else {
          console.warn("No token found in session");
        }
        console.log("Request headers:", config.headers); 
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosPrivateFood.interceptors.response.use(
      (response) => response,
      (error) => Promise.reject(error)
    );

    return () => {
      axiosPrivateFood.interceptors.request.eject(requestInterceptor);
      axiosPrivateFood.interceptors.response.eject(responseInterceptor);
    };
  }, [session]);

  return axiosPrivateFood;
};

export default useAxiosPrivateFood;
