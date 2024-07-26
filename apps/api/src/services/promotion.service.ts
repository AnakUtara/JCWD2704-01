import { Request } from 'express';
import { prisma } from '@/libs/prisma';
import { AuthError, BadRequestError, catchAllErrors, NotFoundError } from '@/utils/error';
import { createPromoSchema, testApplyVoucherSchema, updatePromoSchema } from '@/libs/zod-schemas/promotion.schema';
import { ZodError } from 'zod';
import { imageCreate } from '@/libs/prisma/images.args';
import { ImageType, Prisma, PromoType } from '@prisma/client';
import { reqBodyReducer } from '@/utils/req.body.helper';
import { countTotalPage, paginate } from '@/utils/pagination';

export class PromotionService {
  async applyVocher({ total, promoId, shipCost }: { total: number; shipCost: number; promoId: string }) {
    const voucher = await prisma.promotion.findUnique({
      where: { id: promoId },
    });
    if (!voucher) throw new NotFoundError('not found voucher');
    if (voucher.expiry_date < new Date()) throw new BadRequestError('expire voucher');
    if (total >= voucher.min_transaction) throw new BadRequestError("doesn't meet the requirements");
    let discount: number = 0;
    switch (voucher.type) {
      case 'discount':
        discount = total * voucher.amount;
        break;
      case 'free_shipping':
        discount = shipCost;
        break;
      case 'voucher':
      case 'referral_voucher':
        discount = voucher.amount < total ? voucher.amount : total - voucher.amount;
        break;
    }
    return discount;
  }

  async testApplyVoucher(req: Request) {
    const { promoId, shipCost, total } = testApplyVoucherSchema.parse({ ...req.query, ...req.params });
    const discount = await this.applyVocher({ promoId, shipCost, total });
    return {
      discount,
      total: total - discount,
    };
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
}
export default new PromotionService();
