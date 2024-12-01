"use client";
import { axiosPrivateSalon } from "@/axios/axiosSalon";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const useAxiosPrivateSalon = () => {
  const { data: session } = useSession();

  useEffect(() => {

    if (!session) return;
    
    const requestInterceptor = axiosPrivateSalon.interceptors.request.use(
      (config) => {
        // Ensure correct token reference
        const token = session?.accessToken || session?.user.token;
        // console.log("Session Access Token:", token); 
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        } else {
          console.warn("No token found in session");
        }
        // console.log("Request headers:", config.headers); 
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosPrivateSalon.interceptors.response.use(
      (response) => response,
      (error) => Promise.reject(error)
    );

    return () => {
      axiosPrivateSalon.interceptors.request.eject(requestInterceptor);
      axiosPrivateSalon.interceptors.response.eject(responseInterceptor);
    };
  }, [session]);

  return axiosPrivateSalon;
};

export default useAxiosPrivateSalon;
