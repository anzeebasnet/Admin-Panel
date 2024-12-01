import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_SALONAPI;

export default  axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
})

export const axiosPrivateSalon = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // withCredentials: true,
});