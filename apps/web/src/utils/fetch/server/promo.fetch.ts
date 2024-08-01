import { axiosInstanceSSR } from "@/lib/axios.server-config";
import { SearchParams } from "@/models/search.params";

export async function fetchAllPromos(params: SearchParams) {
  try {
    const res = await axiosInstanceSSR().get("/promotion", { params });
    return res.data.results;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      throw error;
    }
  }
}

export async function fetchAllUserVouchers(params: SearchParams) {
  try {
    const res = await axiosInstanceSSR().get("/promotion/users", { params });
    return res.data.results;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      throw error;
    }
  }
}

export async function fetchAllBuyGetPromos() {
  try {
    const res = await axiosInstanceSSR().get("/promotion/buy-get");
    return res.data.results;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      throw error;
    }
  }
}
