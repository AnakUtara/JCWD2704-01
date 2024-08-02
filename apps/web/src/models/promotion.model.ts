import { TImage } from "./image.model";
import { TStoreStock } from "./storeStock.model";
import { TUser } from "./user.model";

export enum PromoType {
  discount = "discount",
  voucher = "voucher",
  cashback = "cashback",
  referral_voucher = "referral_voucher",
  free_shipping = "free_shipping",
  buy_get = "buy_get",
}

export type TPromotion = {
  id?: string;
  user_id?: string | null;
  user?: TUser | null;
  image_id?: string | null;
  image?: TImage | null;
  title: string;
  description: string;
  amount: number;
  min_transaction: number;
  expiry_date: string;
  is_valid: boolean;
  type: PromoType;
  variant_id: TStoreStock[];
  created_at: Date;
  updated_at: Date;
};
