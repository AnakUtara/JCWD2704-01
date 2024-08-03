import { TStore } from "./store.model";

export type OrderStatus = "wait_for_payment" | "wait_for_confirmation" | "process" | "sending" | "sended" | "canceled";

export interface CustomerOrders {
  id: string;
  inv_no: string;
  user_id: string;

  paymentLink?: string;
  payment_proof?: {
    name: string;
    blob: Uint8Array;
  } | null;
  promotion_id?: string;
  discount: number;
  store_id: string;

  origin_id: string;
  origin: TStore;
  destination_id: string;

  shipping_cost: number;
  order_details: OrderDetail[];
  stock_histories: StockHistory[];
  status: OrderStatus;
  expire: Date;

  created_at: Date;
  updated_at: Date;
}

interface OrderDetail {
  id: string;
  store_stock_id: string;
  unit_price: number;
  discount: number;
  quantity: number;
  transaction_id: string;
  created_at: Date;
  updated_at: Date;
  store_stock: StoreStock;
}

interface StoreStock {
  id: string;
  store_id: string;
  variant_id: string;
  unit_price: number;
  discount: number;
  quantity: number;
  promo_id: string | null;
  created_at: Date;
  updated_at: Date;
  product: ProductVariant;
}

interface ProductVariant {
  id: string;
  type: string;
  image_id: string | null;
  name: string;
  product_id: string;
  weight: number;
  created_at: Date;
  updated_at: Date;
  product: Product;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  shelf_life: string | null;
  nutrition_facts: string | null;
  storage_instructions: string | null;
  category_id: number;
  sub_category_id: number;
  created_at: Date;
  updated_at: Date;
}

interface StockHistory {
  // Properti StockHistory sesuai dengan definisi Anda
}
