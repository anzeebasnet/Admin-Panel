import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { axiosPrivate } from "@/axios/axios";
import {
  FoodItem,
  MenuItem,
  RestroListData,
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
  // setStationList: (data: StationData[]) => void
) => {
  const axiosInstance = useAxiosPrivateFood();
  return useQuery({
    queryKey: ["GET_STATIONLIST"],
    queryFn: async () => {
      const res = await axiosInstance.get("/moreclub/stations/list/");
      const data = res.data.data;
      // setStationList(data);
      return data;
    },
  });
};

export const useStationDetail = (
  stationId: string
) => {
  const axiosInstance = useAxiosPrivateFood();
  return useQuery({
    queryKey: ["GET_STATIONDETAIL"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/moreclub/station/${stationId}/`);
      const data = res.data.data;
      return data;
    },
  });
};

export const useMenuList = (
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
      return data;
    },
  });
};

export const useFoodItemList = (
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
      return data;
    },
  });
};

export const useRestroList = (
) => {
  const axiosInstance = useAxiosPrivateFood();
  return useQuery({
    queryKey: ["GET_RESTROLIST"],
    queryFn: async () => {
      const res = await axiosInstance.get("/restaurants/list/",
        {
          headers: {
            "x-country-code": "NP",
          },
        }
      );
      const data = res.data.data;
      return data;
    },
  });
};

export const useRestroMenuList = (
  restroId: string
) => {
  const axiosInstance = useAxiosPrivateFood();
  return useQuery({
    queryKey: ["GET_RESTROMENULIST"],
    queryFn: async () => {
      const res = await axios.get(
        `https://api.morefood.se/api/moreclub/user/menus/${restroId}/`, {
          headers: {
            Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzMyMDk4NDk3LCJpYXQiOjE3MzIwMTIwOTcsImp0aSI6IjYwNjQ3YzVhYTIwNDQ1OGRiZmU0YmNmMjRkYzFjNjU0IiwidXNlcl9pZCI6IjZmYTk5NDYyLTJkMjgtNDZmZS04MzE2LTg1MGIzYzhjM2Y4YSJ9.EGqNkisEUmmaGOXXnI_dUAYPYA6jhhn6XJvW5rIKxEM"}`,
          },
        }
      );
      const data = res.data.data;
      return data;
    },
  });
};


export const useRestroItemList = (
  restroId: string,
  menuId: string
) => {
  const axiosInstance = useAxiosPrivateFood();
  return useQuery({
    queryKey: ["GET_RESTROITEMLIST"],
    queryFn: async () => {
      const res = await axios.get(
        `https://api.morefood.se/api/moreclub/user/food/items/${menuId}/${restroId}/`,{
          headers: {
            Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzMyMDg4NjMyLCJpYXQiOjE3MzIwMDIyMzIsImp0aSI6IjBlZTEzYWUyN2JjYzRmYTE4NTFmYjJjM2YyNWU5M2I2IiwidXNlcl9pZCI6IjZmYTk5NDYyLTJkMjgtNDZmZS04MzE2LTg1MGIzYzhjM2Y4YSJ9.TnP-81BFMUd7invifSzF5PUYl5GW3430V9957NsWW2s"}`,
          },
        }
      );
      console.log(res.data.data);
      const data = res.data.data;
      return data;
    },
  });
};