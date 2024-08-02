import { initStockSchema, updateStockSchema } from '@/libs/zod-schemas/storeStock.schema';
import { TStoreStock } from '@/models/store.model';
import prisma from '@/prisma';
import { BadRequestError, NotFoundError } from '@/utils/error';
import { reqBodyReducer } from '@/utils/req.body.helper';
import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

export async function checkIsStockAssigned(req: Request, res: Response, next: NextFunction) {
  const { store_id, variant_id } = req.body;
  try {
    const isAssigned = await prisma.storeStock.findFirst({ where: { store_id, variant_id, AND: { is_deleted: false } } });
    if (isAssigned) throw new BadRequestError('Cannot initialize assigned stock. Please use edit to change stock details.');
    next();
  } catch (error) {
    next(error);
  }
}

export async function checkIsStockExist(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;
  try {
    const findStock = await prisma.storeStock.findFirst({ where: { id } });
    if (!findStock) throw new NotFoundError('Stock not found.');
    req.currentStock = findStock as TStoreStock;
    next();
  } catch (error) {
    next(error);
  }
}

export async function validateInitStock(req: Request, res: Response, next: NextFunction) {
  const { quantity, unit_price, discount, promo_id } = req.body;
  try {
    if (quantity) req.body.quantity = Number(req.body.quantity);
    if (unit_price) req.body.unit_price = Number(req.body.unit_price);
    if (discount) req.body.discount = Number(req.body.discount) || 0;
    if (!promo_id) delete req.body.promo_id;
    const validate = initStockSchema.safeParse(req.body);
    if (!validate.success) throw new ZodError(validate.error.errors);
    req.storeStock = validate.data as TStoreStock;
    next();
  } catch (error) {
    next(error);
  }
}

export async function validateUpdateStock(req: Request, res: Response, next: NextFunction) {
  try {
    const data = reqBodyReducer(req.body) as TStoreStock;
    if (data.quantity) data.quantity = Number(data.quantity);
    if (data.unit_price) data.unit_price = Number(data.unit_price);
    if (data.discount) data.discount = Number(data.discount);
    const validate = updateStockSchema.safeParse(data);
    if (!validate.success) throw new ZodError(validate.error.errors);
    req.storeStock = validate.data as TStoreStock;
    next();
  } catch (error) {
    next(error);
  }
}
