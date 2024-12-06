import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { axiosPrivate } from "@/axios/axios";
import {
  FoodItem,
  MenuItem,
  NearByStationDetail,
  RestroListData,
  StationData,
  NearbyStationMenuItem,
  UserListType,
  OrderSummary,
  SalonType,
  RestroDetail,
} from "@/types/types";
import { signIn, useSession } from "next-auth/react";
import useAxiosPrivateFood from "@/hooks/useAxiosPrivateFood";
import useAxiosPrivateSalon from "@/hooks/useAxiosPrivateSalon";

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
  {
    const axiosInstance = useAxiosPrivateFood();
    return useQuery({
      queryKey: ["GET_STATIONLIST"],
      queryFn: async () => {
        const res = await axiosInstance.get("/moreclub/stations/list/");
        const data = res.data.data;
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
      const data: StationData = res.data.data;
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
      const res = await axiosInstance.get("/moreclub/user/restaurants/list/", {
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
  const { data: session } = useSession();
  const token = session?.accessToken || session?.user.token;
  return useQuery({
    queryKey: ["GET_RESTRODETAIL"],
    queryFn: async () => {
      const res = await axios.get(
        `https://api.morefood.se/api/moreclub/user/restaurants/${restroId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data: RestroDetail = res.data.data;
      return data;
    },
  });
};

export const useRestroMenuList = (restroId: string) => {
  const { data: session } = useSession();
  const token = session?.accessToken || session?.user.token;
  return useQuery({
    queryKey: ["GET_RESTROMENULIST"],
    queryFn: async () => {
      const res = await axios.get(
        `https://api.morefood.se/api/moreclub/user/menus/${restroId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
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
      const res = await axiosInstance.get(
        `/moreclub/user/food/items/${menuId}/${restroId}/`,
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
      const res = await axiosInstance.get(
        `/moreclub/user/cuisines/${restroId}/`,
      );
      console.log(res.data.data);
      const data = res.data.data;
      return data;
    },
  });
};

export const useWorkingHours = (restroId: string) => {
  const axiosInstance = useAxiosPrivateFood();
  return useQuery({
    queryKey: ["GET_WORKINGHOURS"],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/moreclub/user/restaurants/${restroId}/working/hours/`, {
          
        }
      );
      console.log(res.data.data);
      const data = res.data.data;
      return data;
    },
  });
};


export const useOfferList = (restroId: string) => {
  const axiosInstance = useAxiosPrivateFood();
  return useQuery({
    queryKey: ["GET_OFFERLIST"],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/moreclub/user/offers/${restroId}/`,
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
      const res = await axiosInstance.get(
        `/moreclub/user/orders/${restroId}/`,
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
      const res = await axiosInstance.get(
        `/moreclub/station/${restroId}/nearby/`,
        {
          headers: {
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
      const res = await axiosInstance.get(
        `/moreclub/station/${stationId}/restaurant/${restroId}/food-items/restro/`,
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
      const res = await axiosInstance.get(
        `/moreclub/station/restro/${stationId}/by/restaurant/`,
      );
      console.log(res.data.data);
      const data: NearByStationDetail = res.data.data;
      return data;
    },
  });
};

export const useMenuListByRestro = (restroId: string) => {
  const axiosInstance = useAxiosPrivateFood();
  return useQuery({
    queryKey: ["GET_MENULISTBYRESTRO"],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/moreclub/station/restro/${restroId}/by/restaurant/menu/`,
      );
      console.log(res.data.data);
      const data = res.data.data;
      return data;
    },
  });
};

export const useStationOrderList = (restroId: string) => {
  const axiosInstance = useAxiosPrivateFood();
  return useQuery({
    queryKey: ["GET_STATIONORDERLIST"],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/moreclub/station/restro/${restroId}/all/orders/`,
      );
      console.log(res.data.data);
      const data = res.data.data;
      return data;
    },
  });
};

export const useOrderSummary = (restroId: string) => {
  const axiosInstance = useAxiosPrivateFood();
  return useQuery({
    queryKey: ["GET_ORDERSUMMARY"],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/moreclub/station/restro/${restroId}/all/orders/summary/`,
      );
      console.log(res.data.data);
      const data: OrderSummary = res.data.data;
      return data;
    },
  });
};

export const useRestroGallery = (restroId: string) => {
  const axiosInstance = useAxiosPrivateFood();
  return useQuery({
    queryKey: ["GET_RESTROGALLERY"],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/moreclub/user/restaurants/gallery/${restroId}/`,
      );
      console.log(res.data.data);
      const data = res.data.data;
      return data;
    },
  });
};

export const usePendingGallery = (restroId: string) => {
  const axiosInstance = useAxiosPrivateFood();
  return useQuery({
    queryKey: ["GET_PENDINGGALLERY"],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/moreclub/user/restaurants/gallery/user/upload/${restroId}/?status=unverified`,
      );
      console.log(res.data.data);
      const data = res.data.data;
      return data;
    },
  });
};

export const useAcceptedGallery = (restroId: string) => {
  const axiosInstance = useAxiosPrivateFood();
  return useQuery({
    queryKey: ["GET_ACCEPTEDGALLERY"],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/moreclub/user/restaurants/gallery/user/upload/${restroId}/?status=verified`,
      );
      console.log(res.data.data);
      const data = res.data.data;
      return data;
    },
  });
};

export const useSalonList = () => {
  const axiosInstance = useAxiosPrivateSalon();
  return useQuery({
    queryKey: ["GET_SALONLIST"],
    queryFn: async () => {
      const res = await axiosInstance.get("/moreclub/users/saloons/list/");
      const data = res.data.data;
      return data;
    },
  });
};

export const useSalonDetail = (salonId: string) => {
  const axiosInstance = useAxiosPrivateSalon();
  return useQuery({
    queryKey: ["GET_SALONDETAIL"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/moreclub/users/saloon/${salonId}/`);
      console.log(res.data.data);
      const data: SalonType = res.data.data;
      return data;
    },
  });
};

export const useSalonServices = (salonId: string) => {
  const axiosInstance = useAxiosPrivateSalon();
  return useQuery({
    queryKey: ["GET_SALONSERVICES"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/moreclub/users/saloons/${salonId}/services/`);
      console.log(res.data.data);
      const data = res.data.data;
      return data;
    },
  });
};

export const useSalonVariation = (salonId: string, serviceId: string) => {
  const axiosInstance = useAxiosPrivateSalon();
  return useQuery({
    queryKey: ["GET_SALONVARIATION"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/moreclub/users/saloons/${salonId}/services/${serviceId}/variations/`);
      console.log(res.data.data);
      const data = res.data.data;
      return data;
    },
  });
};

export const useSalonGallery = (salonId: string) => {
  const axiosInstance = useAxiosPrivateSalon();
  return useQuery({
    queryKey: ["GET_SALONGALLERY"],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/moreclub/users/saloons/${salonId}/gallery/`,
      );
      console.log(res.data.data);
      const data = res.data.data;
      return data;
    },
  });
};

export const useSalonWorkingHours = (salonId: string) => {
  const axiosInstance = useAxiosPrivateSalon();
  return useQuery({
    queryKey: ["GET_SALONWORKINGHOURS"],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/moreclub/users/saloons/${salonId}/opening/hours/`,
      );
      console.log(res.data.data);
      const data = res.data.data;
      return data;
    },
  });
};

export const useSalonStaffList = (salonId: string) => {
  const axiosInstance = useAxiosPrivateSalon();
  return useQuery({
    queryKey: ["GET_SALONSTAFFLIST"],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/moreclub/users/saloons/${salonId}/staff/`, 
      );
      console.log(res.data.data);
      const data = res.data.data;
      return data;
    },
  });
};