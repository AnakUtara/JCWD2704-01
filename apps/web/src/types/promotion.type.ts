type PromotionType = {
  id: string;
  title: string;
  description: string;
  type: "discount" | "voucher" | "cashback" | "referral_voucher" | "free_shipping" | "buy_get";
  amount: number;
  min_transaction: number;
  expiry_date: Date;
  is_valid: boolean;
  userId: string | null;
  image_id: string | null;
  image?: { name: string } | null;
  created_at: Date;
  updated_at: Date;
} | null;
