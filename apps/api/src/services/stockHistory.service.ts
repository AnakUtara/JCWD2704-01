import { stockHistoryMonthly } from '@/libs/prisma/report.queries';
import { stockChangeHandlerSchema } from '@/libs/zod-schemas/stockHistory.schema';
import prisma from '@/prisma';
import { BadRequestError, InternalServerError, NotFoundError } from '@/utils/error';
import { countTotalPage, paginate } from '@/utils/pagination';
import { Prisma } from '@prisma/client';
import { rejects } from 'assert';
import { add } from 'date-fns';
import { Request } from 'express';
// import { products } from 'prisma/data/products';
import { z } from 'zod';

export class StockHistoryService {
  async stockChangeHandler(prisma: Prisma.TransactionClient, { list, reference, changeAll }: z.infer<typeof stockChangeHandlerSchema>) {
    //Get Product Detail
    const p = await Promise.all(
      list.map(async ({ id, quantity }, i) => {
        const product = await prisma.storeStock.findUnique({
          where: { id: id },
        });
        !product
          ? await new Promise((resolve, reject) => {
              reject(new NotFoundError('product not found'));
            })
          : product.quantity >= quantity
            ? null
            : await new Promise((resolve, reject) => {
                reject(new BadRequestError('Cannot buy product more than available stock'));
              });
        if (!product) throw new NotFoundError('product not found');
        return product;
      }),
    );

    //Create History
    const history = await prisma.stockHistory.createMany({
      data: list.map((e, i) => ({
        reference,
        start_qty_at: p[i]?.quantity,
        qty_change: e.quantity * (changeAll == 'increment' ? 1 : -1),
        store_stock_id: p[i]?.id,
      })) as Prisma.StockHistoryCreateManyInput[],
    });

    // Change Stock
    await Promise.all(
      list.map(async ({ id, quantity }) => {
        const a = await prisma.storeStock.update({
          where: { id },
          data: { quantity: { [changeAll]: quantity } },
        });
      }),
    );

    return history;
  }
  async getStockHistories(req: Request) {
    const { page_tab2, search_tab2, store_id, start_date, end_date, sort_by_tab2, sort_dir_tab2 } = req.query;
    const show = 10;
    let where: Prisma.StockHistoryWhereInput = {};
    if (search_tab2)
      where = {
        OR: [
          { store_stock: { store: { address: { address: { contains: String(search_tab2) } } } } },
          { store_stock: { store: { address: { city: { city_name: { contains: String(search_tab2) } } } } } },
          { reference: { contains: String(search_tab2) } },
        ],
      };
    if (store_id) where.AND = { store_stock: { store_id: { equals: String(store_id) } } };
    if (start_date) where = { ...where, created_at: { gte: new Date(String(start_date)), lte: add(new Date(), { days: 1 }) } };
    if (end_date) where = { ...where, created_at: { gte: new Date(String(start_date)), lte: add(new Date(String(end_date)), { days: 1 }) } };
    let queries: Prisma.StockHistoryFindManyArgs = {
      where,
      include: {
        store_stock: { include: { product: { include: { product: true } }, store: { include: { address: { include: { city: true } } } } } },
      },
      orderBy: { created_at: 'desc' },
    };
    if (sort_by_tab2 && sort_dir_tab2) queries = { ...queries, orderBy: { [`${sort_by_tab2}`]: sort_dir_tab2 } };
    if (page_tab2) queries = { ...queries, ...paginate(show, Number(page_tab2)) };
    const data = await prisma.stockHistory.findMany(queries);
    if (!data) throw new NotFoundError('Stock history not found.');
    const count = await prisma.stockHistory.count({ where });
    return { data, totalPages: countTotalPage(count, show) };
  }
  async getStockHistoryReport(req: Request) {
    const { page_tab2, search_tab2, store_id, start_date, end_date, sort_by_tab2, sort_dir_tab2 } = req.query;
    const show = 10;
    const data = await prisma.$queryRaw`${stockHistoryMonthly()}`;
  }
}
export default new StockHistoryService();
