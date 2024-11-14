import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASEAPI;

export default  axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
})

export const axiosPrivateFood = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // withCredentials: true,
});