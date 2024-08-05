import axios from "axios";

export const axiosInstance = () => {
  const baseURL = process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:8000";
  return axios.create({
    baseURL,
  });
};
