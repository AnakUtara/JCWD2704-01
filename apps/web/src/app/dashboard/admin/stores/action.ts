import { axiosInstanceCSR } from "@/lib/axios.client-config";
import { AxiosError } from "axios";

export const deleteStore = async (id: string) => {
  try {
    const response = await axiosInstanceCSR().delete(`/store/v1/${id}`);
    console.log(response.data)
    window.location.reload()
  } catch (error) {
    if (error instanceof AxiosError) console.log(error);
  }
};
