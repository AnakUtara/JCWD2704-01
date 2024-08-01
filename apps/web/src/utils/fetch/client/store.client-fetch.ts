import { axiosInstanceCSR } from "@/lib/axios.client-config";
import { SearchParams } from "@/models/search.params";
import { AxiosError } from "axios";
import { toast } from "sonner";

export async function fetchStoreNamesIdsClient(search_sel2?: string) {
  try {
    const res = await axiosInstanceCSR().get("/store/names-ids", {
      params: { search_sel2 },
    });
    return res.data.results;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      throw error;
    }
  }
}

export async function initStock(data: Record<string, any>) {
  try {
    await axiosInstanceCSR().post("/store/stocks", { ...data });
    toast.success("New stock initialized.");
    window.location.reload();
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log(error.response?.data);
      toast.error(error.response?.data.message);
    }
  }
}

export async function updateStock(id: string, data: Record<string, any>) {
  try {
    await axiosInstanceCSR().patch(`/store/stocks/${id}`, { ...data });
    toast.success("Stock editted.");
    window.location.reload();
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log(error.response?.data);
      toast.error(error.response?.data.message);
    }
  }
}
