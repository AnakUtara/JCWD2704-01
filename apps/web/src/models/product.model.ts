import { TCategory, TSubCategory } from "./category.model";
import { TImage } from "./image.model";
import { TStoreStock } from "./store.model";

export enum Variants {
  weight = "weight",
  volume = "volume",
  size = "size",
  flavour = "flavour",
  pcs = "pcs",
}

export const variants = ["weight", "volume", "size", "flavour", "pcs"];

export type ProductVariant = {
  id: string;
  type: string;
  image_id: string | null;
  name: string;
  product_id: string;
  weight: number;
  variant_image?: File | null;
  images: TImage;
  created_at: string;
  updated_at: string;
  store_stock: TStoreStock[];
  product: Product;
};

export type StoreStock = {
  id: string;
  store_id: string;
  variant_id: string;
  unit_price: number;
  discount: number;
  quantity: number;
  promo_id: string | null;
  created_at: string;
  updated_at: string;
  product: ProductVariant;
};

export type Product = {
  id: string;
  name: string;
  description: string | null;
  shelf_life: string | null;
  nutrition_facts: string | null;
  storage_instructions: string | null;
  category_id: number;
  sub_category_id: number;
  category: TCategory;
  sub_category: TSubCategory;
  variants: ProductVariant[];
  created_at: string;
  updated_at: string;
};
