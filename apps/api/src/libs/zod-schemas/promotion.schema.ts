import { PromoType } from '@prisma/client';
import { z } from 'zod';

export const testApplyVoucherSchema = z.object({
  promoId: z.coerce.string(),
  shipCost: z.coerce.number().min(0),
  total: z.coerce.number().gt(0),
});

export const createPromoSchema = z.object({
  title: z.string().min(5, { message: 'Must have at least 5 characters.' }),
  description: z.string().min(4, { message: 'Must have at least 4 characters.' }).max(180, { message: 'Max. 180 characters.' }),
  amount: z.number().nonnegative(),
  min_transaction: z.number().nonnegative(),
  expiry_date: z.date(),
  type: z.enum([PromoType.discount, PromoType.voucher, PromoType.free_shipping, PromoType.referral_voucher, PromoType.buy_get]),
});

export const updatePromoSchema = z.object({
  title: z.string().min(5, { message: 'Must have at least 5 characters.' }),
  description: z.string().min(4, { message: 'Must have at least 4 characters.' }),
  amount: z.number().nonnegative(),
  min_transaction: z.number().nonnegative(),
  expiry_date: z.date(),
  type: z.enum([PromoType.discount, PromoType.voucher, PromoType.free_shipping, PromoType.referral_voucher, PromoType.buy_get]),
});
