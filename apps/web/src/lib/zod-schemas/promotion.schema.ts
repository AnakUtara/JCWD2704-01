import { PromoType } from "@/models/promotion.model";
import { z } from "zod";

export const createPromoSchema = z.object({
  title: z.string().min(5, { message: "Must have at least 5 characters." }),
  description: z.string().min(4, { message: "Must have at least 4 characters." }),
  amount: z.number().nonnegative(),
  min_transaction: z.number().nonnegative(),
  expiry_date: z.string(),
  type: z.enum([PromoType.discount, PromoType.voucher, PromoType.free_shipping, PromoType.referral_voucher, PromoType.buy_get]),
  promo_image: z
    .instanceof(File)
    .refine((file) => file?.size < 1920 * 1080)
    .refine((file) => file.type.startsWith("image/"))
    .optional(),
});

export const updatePromoImageSchema = z.object({
  promo_image: z
    .instanceof(File, { message: "Required" })
    .refine((file) => file?.size < 1920 * 1080)
    .refine((file) => file.type.startsWith("image/")),
});
