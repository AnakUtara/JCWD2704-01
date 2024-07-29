"use server";
import { axiosInstanceSSR } from "@/lib/axios.server-config";
import { revalidatePath } from "next/cache";

type UpdateCartParams = {
  store_stock_id: string;
  quantity: number;
};

export const updateCart = async ({ store_stock_id, quantity = 0 }: UpdateCartParams) => {
  try {
    if (quantity === 0) await axiosInstanceSSR().delete("/cart", { data: { store_stock_id } });
    else
      await axiosInstanceSSR().post("/cart", {
        store_stock_id,
        quantity,
      });
  
  } catch (error) {
    throw error;
  }
  revalidatePath("/[userId]/cart", "layout");
};
