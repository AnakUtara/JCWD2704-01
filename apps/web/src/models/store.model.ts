import { TAddress } from "./address.model";
import { ProductVariant } from "./product.model";
import { TPromotion } from "./promotion.model";
import { TUser } from "./user.model";

export type TStore = {
  address_id: string;
  address: TAddress;
  store_admin: TUser[];
  product_stock: TStoreStock[];
  created_at: Date;
  updated_at: Date;
};

export type TStoreStock = {
  id?: string;
  store_id: string;
  store?: TStore | null;
  variant_id: string;
  product?: ProductVariant | null;
  stock_history?: TStockHistory[] | null;
  unit_price: number;
  discount?: number | null;
  promo_id?: string | null;
  promo?: TPromotion | null;
  quantity: number;
  reference?: string | null;
  created_at?: Date;
  updated_at?: Date;
};

export type TStockHistory = {
  id?: string;
  store_stock_id?: string | null;
  store_stock: TStoreStock;
  start_qty_at: number;
  qty_change: number;
  reference?: string | null;
  transaction_id?: string | null;
  created_at?: Date;
  updated_at?: Date;
};
