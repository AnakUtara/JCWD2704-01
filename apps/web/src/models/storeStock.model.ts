import { TCart } from "./cart.model";
import { TProductVariant } from "./productVariant.model";
import { TStore } from "./store.model";

export type TStoreStock = {
  id: string;
  store_id: string;
  store: TStore;
  variant_id: string;
  product: TProductVariant;
  unit_price: number;
  discount: number;
  quantity: number;
  promo_id?: string | null;
  cart: TCart[];
  is_deleted: boolean;
  created_at: Date;
  updated_at: Date;
};
