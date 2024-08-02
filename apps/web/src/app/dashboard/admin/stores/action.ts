import { axiosInstanceCSR } from "@/lib/axios.client-config";
import { AxiosError } from "axios";

export const deleteStore = async (id: string) => {
  try {
    await axiosInstanceCSR().delete(`/store/v1/${id}`);
    window.location.reload();
  } catch (error) {
    if (error instanceof AxiosError) console.log(error);
  }
};
