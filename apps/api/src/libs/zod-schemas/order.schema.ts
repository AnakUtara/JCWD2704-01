import { z } from 'zod';

export const createOrderSchema = z.object({
  store_id: z.string(),
  destination_id: z.string(),
  promotion_id: z.string().optional(),
  courier: z.enum(['jne', 'pos', 'tiki']),
  courier_service: z.string(),

  req_products: z
    .array(
      z.object({
        id: z.string(),
        quantity: z.number().min(1),
      }),
    )
    .min(1),
});

export const rajaOngkirCostQuerySchema = z.object({
  origin: z.string(),
  destination: z.string(),
  weight: z.string(),
  courier: z.enum(['jne', 'pos', 'tiki']),
});

export const rajaOngkirCostParamSchema = z.object({
  origin: z.preprocess((val) => Math.ceil(parseInt(val as string, 10)), z.number()),
  destination: z.preprocess((val) => Math.ceil(parseInt(val as string, 10)), z.number()),
  weight: z.preprocess((val) => Math.ceil(parseInt(val as string, 10)), z.number()),
  courier: z.enum(['jne', 'pos', 'tiki']),
});

export const getOrderQuerySchema = z.object({
  before: z.coerce.number().optional(),
  after: z.coerce.number().optional(),
  asc: z.enum(['asc', 'desc']).optional(),
  store_id: z.coerce.string().optional(),
  pn: z.coerce.string().optional(),
  inv: z.coerce.string().optional(),
  page_tab1: z.coerce.number().optional(),
});

export const getSalesReportSchema = z.object({
  year: z.coerce.number(),
  category: z.enum(['']).optional(),
  pn: z.coerce.string().optional(),
  store_id: z.coerce.string().optional(),
});
