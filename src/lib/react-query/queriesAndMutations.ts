import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosPrivate } from "@/axios/axios";
import { LoginResponse, UserListType } from "@/types/types";
import { signIn } from "next-auth/react";

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
      const res = await axiosPrivate.get(`/admin/user/list/?page=${page}`);
      const data = res.data.data;
      setUserList(res.data.data);
      setTotalPages(res.data.meta.total_pages);
      setFilteredData(res.data.data);
      return data;
    },
  });
};
