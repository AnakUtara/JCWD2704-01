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

export async function fetchStoreNamesIds(params?: SearchParams) {
  try {
    const res = await axiosInstanceSSR().get(
      "/store/names-ids",
      params && {
        params,
      },
    );
    return res.data.results;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      throw error;
    }
  }
}

export async function fetchStoreByCityId(city_id: number) {
  try {
    const res = await axiosInstanceSSR().get(`/store/${city_id}`);
    return res.data.results;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      throw error;
    }
  }
}

export async function fetchAllProductsByCityId(city_id: number) {
  try {
    const res = await axiosInstanceSSR().get(`/store/products`, {
      params: { city_id },
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

export async function fetchProductsByQuery(params: SearchParams) {
  try {
    const res = await axiosInstanceSSR().get("/store/stocks/find", { params });
    return res.data.results;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      throw new Error(
        "Oops... We're sorry. It seems like your area doesn't have us yet. Kindly wait for any future updates about our appearance there.",
      );
    }
  }
}
