import { axiosInstanceCSR } from "@/lib/axios.client-config";
import { AxiosError } from "axios";
import { toast } from "sonner";

export async function createPromo(data: Record<string, any>) {
  try {
    await axiosInstanceCSR().post("/promotion", { ...data }, { headers: { "Content-Type": "multipart/form-data" } });
    toast.success("New promotion added.");
    window.location.reload();
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log(error.response?.data);
      toast.error(error.response?.data.message);
    }
  }
}

export async function updateImagePromo(data: Record<string, any>, id: string) {
  try {
    await axiosInstanceCSR().patch(`/promotion/${id}`, { ...data }, { headers: { "Content-Type": "multipart/form-data" } });
    toast.success("Promo image updated.");
    window.location.reload();
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log(error.response?.data);
      toast.error(error.response?.data.message);
    }
  }
}

export async function fetchAllBuyGetPromosClient() {
  try {
    const res = await axiosInstanceCSR().get("/promotion/buy-get");
    return res.data.results;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      throw error;
    }
  }
}
