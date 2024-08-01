import prisma from '@/prisma';
import { BadRequestError, catchAllErrors, NotFoundError } from '@/utils/error';
import { countTotalPage, paginate } from '@/utils/pagination';
import { Prisma, StoreStock } from '@prisma/client';
import { add } from 'date-fns';
import { Request } from 'express';

export class StoreStockService {
  async getStoreStockById(id: string) {
    const result = await prisma.storeStock.findUnique({
      where: { id },
      include: { product: { include: { product: { include: { category: { include: { sub_categories: true } } } } } } },
    });
    if (!result) throw new NotFoundError('Product not found');
    return result;
  }

  async getStoreStocks(req: Request) {
    const { page_tab1, search_tab1, store_id, start_date, end_date, sort_by_tab1, sort_dir_tab1 } = req.query;
    const show = 10;
    const where: Prisma.StoreStockWhereInput = { is_deleted: false };
    if (search_tab1)
      where.AND = {
        OR: [
          { product: { name: { contains: String(search_tab1) } } },
          { store: { address: { address: { contains: String(search_tab1) } } } },
          { store: { address: { city: { city_name: { contains: String(search_tab1) } } } } },
          { product: { product: { name: { contains: String(search_tab1) } } } },
        ],
      };
    if (store_id) where.AND = { ...where.AND, store_id: { equals: String(store_id) } };
    if (start_date) where.AND = { ...where.AND, created_at: { gte: new Date(String(start_date)), lte: add(new Date(), { days: 1 }) } };
    if (end_date) where.AND = { ...where.AND, created_at: { gte: new Date(String(start_date)), lte: add(new Date(String(end_date)), { days: 1 }) } };
    let queries: Prisma.StoreStockFindManyArgs = {
      where,
      orderBy: { created_at: 'desc' },
      include: {
        product: { include: { images: { select: { name: true } }, product: { select: { name: true } } } },
        store: { include: { address: { include: { city: { select: { city_name: true } } } } } },
        stock_history: { orderBy: { created_at: 'desc' } },
        promo: true,
      },
    };
    if (page_tab1) queries = { ...queries, ...paginate(show, Number(page_tab1)) };
    if (sort_by_tab1 && sort_dir_tab1) queries.orderBy = { [`${sort_by_tab1}`]: sort_dir_tab1 };
    const data = await prisma.storeStock.findMany(queries);
    if (!data) throw new NotFoundError('Stocks data not found.');
    const count = await prisma.storeStock.count({ where });
    return { data, totalPages: countTotalPage(count, show) };
  }

  async getProductByStoreId(req: Request) {
    const { filter, search, city_id, page } = req.query;
    const show = 20;
    const where: Prisma.ProductWhereInput = {
      is_deleted: false,
      AND: { variants: { some: { store_stock: { some: { store: { address: { city_id: Number(city_id) } } } } } } },
    };
    let queries: Prisma.ProductFindManyArgs = {
      where,
      include: { variants: { include: { store_stock: { include: { promo: true } }, images: { select: { name: true } } } } },
    };
    if (filter)
      where.AND = { ...where, OR: [{ category: { name: { equals: String(filter) } } }, { sub_category: { name: { equals: String(filter) } } }] };
    if (search) where.AND = { ...where, OR: [{ name: { contains: String(search) } }] };
    if (page) queries = { ...queries, ...paginate(show, Number(page)) };
    const products = await prisma.product.findMany(queries);
    const count = await prisma.product.count({ where });
    if (!products) throw new NotFoundError('Products not found.');
    return { products, totalPage: countTotalPage(count, show) };
  }

  async getProductDetailsByStoreId(req: Request) {
    const { name } = req.params;
    const { city_id } = req.query;
    const where: Prisma.ProductWhereInput = {
      is_deleted: false,
      AND: [
        { name: { equals: name?.replaceAll('-', ' ') } },
        { variants: { some: { store_stock: { some: { store: { address: { city_id: Number(city_id) } } } } } } },
      ],
    };
    const data = await prisma.product.findFirst({
      where,
      include: {
        category: { include: { image: { select: { name: true } } } },
        sub_category: true,
        variants: { include: { images: { select: { name: true } }, store_stock: { include: { promo: true } } } },
      },
    });
    if (!data) throw new NotFoundError('Cannot find product');
    return data;
  }

  async getProductRecommendationsByCityId(req: Request) {
    const { city_id, store_stock_id, page } = req.query;
    const show = 20;
    let where: Prisma.ProductWhereInput = { is_deleted: false };
    if (city_id && store_stock_id)
      where = {
        ...where,
        AND: [
          { variants: { some: { store_stock: { some: { store: { address: { city_id: Number(city_id) } } } } } } },
          { NOT: { variants: { some: { store_stock: { some: { id: String(store_stock_id) } } } } } },
        ],
      };
    let queries: Prisma.ProductFindManyArgs = { where };
    if (page) queries = { ...queries, ...paginate(show, Number(page)) };
    try {
      const data = await prisma.product.findMany(queries);
      const count = await prisma.product.count({ where });
      if (!data) throw new NotFoundError('Products not found.');
      return { data, totalPage: countTotalPage(count, Number(show)) };
    } catch (error) {
      catchAllErrors(error);
    }
  }

  async initStock(req: Request) {
    const stock = { ...req?.storeStock };
    const history = req.storeStock?.reference;
    delete stock.reference;
    await prisma.$transaction(async (prisma) => {
      const initStock = await prisma.storeStock.create({
        data: stock as StoreStock,
        include: { store: { include: { address: true } } },
      });
      await prisma.stockHistory.create({
        data: {
          store_stock: { connect: { id: initStock.id } },
          start_qty_at: 0,
          qty_change: Number(initStock.quantity),
          reference: history || `Initial stock assignment to store address: ${initStock.store.address.address}.`,
        },
      });
    });
  }

  async updateStock(req: Request) {
    const stock = { ...req?.storeStock };
    const reference = req.storeStock?.reference;
    delete stock?.reference;
    const currentQty = Number(req.currentStock?.quantity);
    const qtyChange = Number(stock?.quantity);
    const stockCalc = currentQty + qtyChange;
    if (stockCalc < 0) throw new BadRequestError('Quantity cannot be minus/less than 0.');
    await prisma.$transaction(async (prisma) => {
      await prisma.stockHistory.create({
        data: {
          store_stock: { connect: { id: req.currentStock?.id as string } },
          start_qty_at: currentQty,
          qty_change: qtyChange,
          reference: reference as string,
        },
      });
      await prisma.storeStock.update({
        where: { id: req.currentStock?.id },
        data: {
          ...(stock as StoreStock),
          quantity: Math.sign(stockCalc) === -1 ? 0 : stockCalc,
        },
      });
    });
  }

  async deleteStock(req: Request) {
    await prisma.storeStock.update({
      where: { id: req.params.id },
      data: { is_deleted: true },
    });
  }
}

export default new StoreStockService();
