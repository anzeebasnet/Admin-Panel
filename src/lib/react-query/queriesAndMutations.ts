import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { axiosPrivate } from "@/axios/axios";
import {
  FoodItem,
  LoginResponse,
  MenuItem,
  StationData,
  UserListType,
} from "@/types/types";
import { signIn } from "next-auth/react";
import useAxiosPrivateFood from "@/hooks/useAxiosPrivateFood";

// export const useLogin = () => {
//   return useMutation({
//     mutationFn: async (formData: {
//       email: string;
//       password: string;
//     }): Promise<LoginResponse> => {
//       const res = await signIn("credentials", {
//         email: formData.email,
//         password: formData.password,
//         redirect: false,
//         callbackUrl: "/",
//       });

//       if (res?.error) {
//         throw new Error(res.error);
//       }

//       return res as unknown as LoginResponse;
//     },
//   });
// };

export const useUsersList = (
  page: number,
  setTotalPages: (pages: number) => void,
  setFilteredData: (data: UserListType[]) => void,
  setUserList: (data: UserListType[]) => void
) => {
  return useQuery({
    queryKey: ["GET_USERSLIST"],
    queryFn: async () => {
      const res = await axios.get(`/admin/user/list/?page=${page}`);
      const data = res.data.data;
      setUserList(res.data.data);
      setTotalPages(res.data.meta.total_pages);
      setFilteredData(res.data.data);
      return data;
    },
  });
};

export const useStationList = (
  setStationList: (data: StationData[]) => void
) => {
  const axiosInstance = useAxiosPrivateFood();
  return useQuery({
    queryKey: ["GET_STATIONLIST"],
    queryFn: async () => {
      const res = await axiosInstance.get("/moreclub/stations/list/");
      const data = res.data.data;
      setStationList(data);
      return data;
    },
  });
};

export const useMenuList = (
  setMenuList: (data: MenuItem[]) => void,
  stationId: string
) => {
  const axiosInstance = useAxiosPrivateFood();
  return useQuery({
    queryKey: ["GET_MENULIST"],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/moreclub/station/${stationId}/menu/`
      );
      const data = res.data.data;
      setMenuList(res.data.data);
      return data;
    },
  });
};

export const useFoodItemList = (
  setFoodList: (data: FoodItem[]) => void,
  stationId: string,
  menuId: string
) => {
  const axiosInstance = useAxiosPrivateFood();
  return useQuery({
    queryKey: ["GET_FOODITEMLIST"],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/moreclub/station/${stationId}/${menuId}/food-items/`
      );
      console.log(res.data.data);
      const data = res.data.data;
      setFoodList(res.data.data);
      return data;
    },
  });
};
