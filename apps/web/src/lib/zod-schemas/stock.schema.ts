import { z } from "zod";

const errors = {
  price: { message: "Price need to be at least Rp.100,-/item" },
  pos: { message: "Need to be a positive number." },
  qty: { message: "Quantity need to be at least 1 item." },
  disc: { message: "Discount need to start at least at 5%" },
  ref: { message: "Reference must contain at least 8 characters" },
};

export const initStockSchema = z.object({
  store_id: z.string().trim(),
  variant_id: z.string().trim(),
  unit_price: z.number().min(100, errors.price.message).positive(errors.pos.message),
  quantity: z.number().min(1, errors.qty.message).positive(errors.pos.message),
  discount: z.number().optional(),
  promo_id: z.string().trim().optional(),
  reference: z.string().trim().optional(),
});

const quantityAndReferrence = z
  .object({
    quantity: z.number().optional(),
    reference: z.string().trim().optional(),
  })
  .refine((data) => data.quantity || data.reference, {
    message: "Quantity required",
    path: ["quantity"],
  });

export const updateStockSchema = z
  .object({
    unit_price: z.number().min(100, errors.price.message).positive(errors.pos.message).optional(),
    quantity: z.number().optional(),
    discount: z.number().nonnegative(errors.pos.message).optional(),
    promo_id: z.string().trim().optional(),
    reference: z.string().trim().optional(),
  })
  .and(quantityAndReferrence);
