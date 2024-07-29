import axios, { AxiosInstance } from "axios";
import { cookies } from "next/headers";

export function axiosInstanceSSR(): AxiosInstance {
  const token = cookies().get("access_token")?.value || '';
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
