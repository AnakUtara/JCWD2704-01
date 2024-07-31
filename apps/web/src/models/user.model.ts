import { TAddress } from "./address.model";
import { TCart } from "./cart.model";
import { TStore } from "./store.model";

export enum Role {
  customer = "customer",
  store_admin = "store_admin",
  super_admin = "super_admin",
}

export enum Gender {
  male = "male",
  female = "female",
}

export type TUser = {
  id?: string;
  email: string;
  avatar?: { name: string } | null;
  avatar_id?: string;
  reset_token?: string;
  referral_code?: string;
  reference_code?: string;
  is_verified?: boolean;
  role: Role;
  store_id?: string;
  full_name?: string;
  gender?: Gender;
  dob?: string;
  phone_no?: string;
  is_banned: boolean;
  created_at?: string;
  updated_at?: string;
  store?: TStore | null;
  addresses: TAddress[] | [];
  promotions: PromotionType[] | [];
  cart: TCart[] | [];
};
