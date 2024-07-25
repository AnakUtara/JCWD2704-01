import { axiosInstanceSSR } from "@/lib/axios.server-config";
import { SearchParams } from "@/models/search.params";

export async function fetchStocks(params: SearchParams, store_id?: string) {
  try {
    const res = await axiosInstanceSSR().get("/store/stocks", {
      params: store_id ? { ...params, store_id } : { ...params },
    });
    return res.data.results;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      throw error;
    }
  }
}

export async function fetchStoreNamesIds(params: SearchParams) {
  try {
    const res = await axiosInstanceSSR().get("/store/names-ids", {
      params,
    });
    return res.data.results;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      throw error;
    }
  }
}

export async function fetchStockHistories(params: SearchParams, store_id?: string) {
  try {
    const res = await axiosInstanceSSR().get("/store/stocks/histories", {
      params: store_id ? { ...params, store_id } : { ...params },
    });
    return res.data.results;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      throw error;
    }
  }
}
