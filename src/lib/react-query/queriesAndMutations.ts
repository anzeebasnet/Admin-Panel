import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { axiosPrivate } from "@/axios/axios";
import {
  FoodItem,
  MenuItem,
  NearByStationDetail,
  RestroListData,
  StationData,
  StationMenuItem,
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

export const useStationList = () =>
  // setStationList: (data: StationData[]) => void
  {
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

export const useStationDetail = (stationId: string) => {
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

export const useMenuList = (stationId: string) => {
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

export const useFoodItemList = (stationId: string, menuId: string) => {
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

export const useRestroList = () => {
  const axiosInstance = useAxiosPrivateFood();
  return useQuery({
    queryKey: ["GET_RESTROLIST"],
    queryFn: async () => {
      const res = await axiosInstance.get("/restaurants/list/", {
        headers: {
          "x-country-code": "NP",
        },
      });
      const data = res.data.data;
      return data;
    },
  });
};

export const useRestroDetail = (restroId: string) => {
  const axiosInstance = useAxiosPrivateFood();
  return useQuery({
    queryKey: ["GET_RESTRODETAIL"],
    queryFn: async () => {
      const res = await axios.get(
        `https://api.morefood.se/api/moreclub/user/restaurants/${restroId}/`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
          },
        }
      );
      const data = res.data.data;
      return data;
    },
  });
};

export const useRestroMenuList = (restroId: string) => {
  const axiosInstance = useAxiosPrivateFood();
  return useQuery({
    queryKey: ["GET_RESTROMENULIST"],
    queryFn: async () => {
      const res = await axios.get(
        `https://api.morefood.se/api/moreclub/user/menus/${restroId}/`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
          },
        }
      );
      const data = res.data.data;
      return data;
    },
  });
};

export const useRestroItemList = (restroId: string, menuId: string) => {
  const axiosInstance = useAxiosPrivateFood();
  return useQuery({
    queryKey: ["GET_RESTROITEMLIST"],
    queryFn: async () => {
      const res = await axios.get(
        `https://api.morefood.se/api/moreclub/user/food/items/${menuId}/${restroId}/`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
          },
        }
      );
      console.log(res.data.data);
      const data = res.data.data;
      return data;
    },
  });
};

export const useCuisineList = (restroId: string) => {
  const axiosInstance = useAxiosPrivateFood();
  return useQuery({
    queryKey: ["GET_CUISINELIST"],
    queryFn: async () => {
      const res = await axios.get(
        `https://api.morefood.se/api/moreclub/user/cuisines/${restroId}/`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
          },
        }
      );
      console.log(res.data.data);
      const data = res.data.data;
      return data;
    },
  });
};

export const useOrderList = (restroId: string) => {
  const axiosInstance = useAxiosPrivateFood();
  return useQuery({
    queryKey: ["GET_ORDERLIST"],
    queryFn: async () => {
      const res = await axios.get(
        `https://api.morefood.se/api/moreclub/user/orders/${restroId}/`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
          },
        }
      );
      console.log(res.data.data);
      const data = res.data.data;
      return data;
    },
  });
};


export const useNearbyStationList = (restroId: string) => {
  const axiosInstance = useAxiosPrivateFood();
  return useQuery({
    queryKey: ["GET_NEARBYSTATIONLIST"],
    queryFn: async () => {
      const res = await axios.get(
        `https://api.morefood.se/api/moreclub/station/${restroId}/nearby/`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
            "x-country-code": "NP",
          },
        }
      );
      console.log(res.data.data);
      const data = res.data.data;
      return data;
    },
  });
};


export const useStationMenu = (restroId: string, stationId: string) => {
  const axiosInstance = useAxiosPrivateFood();
  return useQuery({
    queryKey: ["GET_STATIONMENU"],
    queryFn: async () => {
      const res = await axios.get(
        `https://api.morefood.se/api/moreclub/station/${stationId}/restaurant/${restroId}/food-items/restro/`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
          },
        }
      );
      console.log(res.data.data);
      const data = res.data.data;
      return data;
    },
  });
};


export const useNearbyStationDetail = (stationId: string) => {
  const axiosInstance = useAxiosPrivateFood();
  return useQuery({
    queryKey: ["GET_NEARBYSTATIONDETAIL"],
    queryFn: async () => {
      const res = await axios.get(
        `https://api.morefood.se/api/moreclub/station/restro/${stationId}/by/restaurant/`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
          },
        }
      );
      console.log(res.data.data);
      const data:NearByStationDetail = res.data.data;
      return data;
    },
  });
};


export const useMenuListByRestro = (restroId: string) => {
  const axiosInstance = useAxiosPrivateFood();
  return useQuery({
    queryKey: ["GET_MENULISTBYRESTRO"],
    queryFn: async () => {
      const res = await axios.get(
        `https://api.morefood.se/api/moreclub/station/restro/${restroId}/by/restaurant/menu/`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
          },
        }
      );
      console.log(res.data.data);
      const data = res.data.data;
      return data;
    },
  });
};