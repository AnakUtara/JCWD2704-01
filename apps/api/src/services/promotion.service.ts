import { Request } from 'express';
import { prisma } from '@/libs/prisma';
import { AuthError, BadRequestError, catchAllErrors, NotFoundError } from '@/utils/error';
import { createPromoSchema, testApplyVoucherSchema } from '@/libs/zod-schemas/promotion.schema';
import { ImageType, Prisma, PromoType } from '@prisma/client';
import stockHistoryService from './stockHistory.service';
import { countTotalPage, paginate } from '@/utils/pagination';
import { imageCreate, imageUpdate } from '@/libs/prisma/images.args';
import { ZodError } from 'zod';

async function applyVocher({ total, promoId, shipCost }: { total: number; shipCost: number; promoId: string }, updateValid = true) {
  const where = { id: promoId };
  const voucher = await prisma.promotion.findUnique({
    where,
    include: { user: true },
  });
  if (!voucher) throw new NotFoundError('not found voucher');
  if (voucher.expiry_date < new Date()) throw new BadRequestError('expire voucher');
  if (total < voucher.min_transaction) throw new BadRequestError(`min transaction :${voucher.min_transaction}`);
  let discount: number = 0;
  switch (voucher.type) {
    case 'discount':
    case 'referral_voucher':
      discount = (total * voucher.amount) / 100;
      break;
    case 'free_shipping':
      discount = shipCost;
      break;
    case 'voucher':
      discount = voucher.amount < total ? voucher.amount : total;
      break;
    default:
      discount = 0;
  }
  if (voucher.user && updateValid) {
    await prisma.promotion.update({ where, data: { is_valid: false } });
  }
  return discount;
}

export class PromotionService {
  async applyVocher({ total, promoId, shipCost }: { total: number; shipCost: number; promoId: string }, updateValid = true) {
    return await applyVocher({ total, promoId, shipCost });
  }

  async testApplyVoucher(req: Request) {
    const { promoId, shipCost, total } = testApplyVoucherSchema.parse({ ...req.query, ...req.params });
    const discount = await applyVocher({ promoId, shipCost, total }, false);
    return {
      discount,
      total: total - discount,
    };
  }

  async appyBuy1Get1(prisma: Prisma.TransactionClient, storeStock_id: string, quantity: number, transaction_id: string) {
    const isProductPromoValid = await prisma.storeStock.findUnique({ where: { id: storeStock_id, promo: { type: 'buy_get', is_valid: true } } });
    if (isProductPromoValid) {
      await stockHistoryService.stockChangeHandler(
        prisma,
        {
          changeAll: 'decrement',
          list: [{ id: storeStock_id, quantity }],
          reference: 'Buy 1 Get 1 Bonus',
        },
        transaction_id,
      );
    }
  }

  async getBuyGetPromos(req: Request) {
    return await prisma.promotion.findMany({
      where: {
        type: 'buy_get',
        expiry_date: { gt: new Date().toISOString() },
        is_valid: true,
      },
    });
  }

  async getCustomerVouchers(req: Request) {
    if (!req.user) throw new AuthError();
    const user_id = req.query.user_id as string | undefined;
    return await prisma.promotion.findMany({
      where: {
        ...(req.user.role == 'customer' ? { user_id: req.user.id } : { user_id: user_id }),
        expiry_date: { gt: new Date().toISOString() },
        is_valid: true,
      },
    });
  }

  async getAllPromotions(req: Request) {
    try {
      const { search_tab1, page_tab1, sort_by_tab1, sort_dir_tab1, type } = req.query;
      const show = 10;
      let where: Prisma.PromotionWhereInput = { NOT: [{ type: PromoType.referral_voucher }, { type: PromoType.free_shipping }] };
      if (search_tab1) where.AND = { OR: [{ title: { contains: String(search_tab1) } }] };
      if (type) where.AND = { type: { equals: type as PromoType } };
      let queries: Prisma.PromotionFindManyArgs = {
        where,
        include: {
          user: true,
          variant_id: { include: { product: { include: { product: { select: { name: true } } } } } },
          image: { select: { name: true } },
        },
        orderBy: { created_at: 'desc' },
      };
      if (sort_by_tab1 && sort_dir_tab1) queries.orderBy = { [`${sort_by_tab1}`]: String(sort_dir_tab1) };
      if (page_tab1) queries = { ...queries, ...paginate(show, Number(page_tab1)) };
      const data = await prisma.promotion.findMany(queries);
      const count = await prisma.promotion.count({ where });
      if (!data) throw new NotFoundError('Promotions not found');
      return { data, totalPage: countTotalPage(count, show) };
    } catch (error) {
      catchAllErrors(error);
    }
  }

  async getAllUserVouchers(req: Request) {
    try {
      const { search_tab2, page_tab2, sort_by_tab2, sort_dir_tab2 } = req.query;
      const show = 10;
      let where: Prisma.PromotionWhereInput = { AND: { OR: [{ type: PromoType.referral_voucher }, { type: PromoType.free_shipping }] } };
      if (search_tab2) where = { ...where, title: { contains: String(search_tab2) } };
      let queries: Prisma.PromotionFindManyArgs = { where, include: { user: true } };
      if (page_tab2) queries = { ...queries, ...paginate(show, Number(page_tab2)) };
      if (sort_by_tab2 && sort_dir_tab2) queries.orderBy = { [`${sort_by_tab2}`]: sort_dir_tab2 };
      const data = await prisma.promotion.findMany(queries);
      if (!data) throw new NotFoundError('User vouchers not found.');
      const count = await prisma.promotion.count({ where });
      return { data, totalPage: countTotalPage(count, show) };
    } catch (error) {
      catchAllErrors(error);
    }
  }

  async createPromotion(req: Request) {
    try {
      const { file } = req;
      const { amount, min_transaction, expiry_date } = req.body;
      if (amount) req.body.amount = Number(req.body.amount);
      if (min_transaction) req.body.min_transaction = Number(req.body.min_transaction);
      if (expiry_date) req.body.expiry_date = new Date(req.body.expiry_date);
      const validate = createPromoSchema.safeParse(req.body);
      if (!validate.success) throw new ZodError(validate.error.errors);
      await prisma.$transaction(async (prisma) => {
        let queries: Prisma.PromotionCreateArgs = { data: { ...validate.data } };
        const image = file ? await prisma.image.create(await imageCreate(req, ImageType.promotion)) : null;
        if (image) queries.data.image = { connect: { id: image.id } };
        await prisma.promotion.create(queries);
      });
    } catch (error) {
      catchAllErrors(error);
    }
  }
  async updatePromoImage(req: Request) {
    try {
      const { id } = req.params;
      const { file } = req;
      if (!file) throw new BadRequestError('Image is required.');
      await prisma.$transaction(async (prisma) => {
        const findImage = await prisma.promotion.findFirst({ where: { id } });
        if (!findImage?.image_id) {
          const image = await prisma.image.create(await imageCreate(req, ImageType.promotion));
          await prisma.promotion.update({ where: { id }, data: { image: { connect: { id: image.id } } } });
        } else {
          await prisma.image.update(await imageUpdate(req, findImage.image_id));
        }
      });
    } catch (error) {
      catchAllErrors(error);
    }
  }
  async deletePromotion(req: Request) {
    const { id } = req.params;
    try {
      await prisma.promotion.update({
        where: { id },
        data: { is_valid: false },
      });
    } catch (error) {
      catchAllErrors(error);
    }
  }

  async getAllValidPromos(req: Request) {
    try {
      const promos = await prisma.promotion.findMany({
        where: {
          is_valid: true,
          expiry_date: { gte: new Date() },
          AND: [{ type: { not: PromoType.referral_voucher } }, { type: { not: PromoType.free_shipping } }, { type: { not: PromoType.buy_get } }],
        },
      });
      if (!promos) throw new NotFoundError('Promos not found.');
      return promos;
    } catch (error) {
      catchAllErrors(error);
    }
  }

  async getUserVouchersByUserID(req: Request) {
    try {
      const vouchers = await prisma.promotion.findFirst({
        where: { user_id: req.user?.id },
      });
      return vouchers;
    } catch (error) {
      catchAllErrors(error);
    }
  }

  async getAllFeaturedPromos(req: Request) {
    try {
      const promos = await prisma.image.findMany({
        where: { type: 'promotion', promotion: { is_valid: true, expiry_date: { gte: new Date() } } },
        select: { name: true, promotion: true },
      });
      if (!promos) throw new NotFoundError('Promo images not found.');
      return promos;
    } catch (error) {
      catchAllErrors(error);
    }
  }
}
export default new PromotionService();
