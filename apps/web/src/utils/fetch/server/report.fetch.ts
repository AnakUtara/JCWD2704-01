import { axiosInstanceSSR } from "@/lib/axios.server-config";
import { SearchParams } from "@/models/search.params";

export async function getStockReport(params: SearchParams) {
  try {
    const res = await axiosInstanceSSR().get("/store/stocks/report", { params });
    return res.data.results;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      throw error;
    }
  }
}

export async function getSalesReport(params: SearchParams) {
  try {
    const res = await axiosInstanceSSR().get("/order/report", { params });
    return res.data.results;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      throw error;
    }
  }
}
