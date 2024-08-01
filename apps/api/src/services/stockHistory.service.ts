import { stockHistoryMonthly } from '@/libs/prisma/report.queries';
import { stockChangeHandlerSchema } from '@/libs/zod-schemas/stockHistory.schema';
import prisma from '@/prisma';
import { BadRequestError, NotFoundError } from '@/utils/error';
import { countTotalPage, paginate } from '@/utils/pagination';
import { Prisma } from '@prisma/client';
import { add } from 'date-fns';
import { Request } from 'express';
import { z } from 'zod';

export class StockHistoryService {
  async stockChangeHandler(
    prisma: Prisma.TransactionClient,
    { list, reference, changeAll }: z.infer<typeof stockChangeHandlerSchema>,
    transaction_id = undefined as string | undefined,
  ) {
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
        transaction_id,
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
    const { page_tab2, store_id, month, year } = req.query;
    const show = 10;
    const report =
      await prisma.$queryRaw`with stock_summary as(select pv.name as variant_name, p.name as product_name, loc.address as store_address, s.address_id as store_id, 
      DATE_FORMAT(sh.created_at, '%Y-%m-01') AS month, 
      SUM(CASE WHEN sh.qty_change > 0 THEN sh.qty_change ELSE 0 END) AS total_additions,
      SUM(CASE WHEN sh.qty_change < 0 THEN ABS(sh.qty_change) ELSE 0 END) AS total_subtractions,
      SUM(CASE WHEN sh.qty_change > 0 THEN sh.qty_change ELSE 0 END) - SUM(CASE WHEN sh.qty_change < 0 THEN ABS(sh.qty_change) ELSE 0 END) AS final_qty
      from stock_history sh
      join store_stock ss on ss.id = sh.store_stock_id
      join product_variants pv on ss.variant_id = pv.id
      join products p on pv.product_id = p.id
      join stores s on ss.store_id = s.address_id
      join addresses loc on s.address_id = loc.id
      group by p.name, pv.name, month, loc.id)
      select sts.variant_name, sts.product_name, sts.store_id, sts.store_address, sts.month, sts.total_additions, sts.total_subtractions, sts.final_qty
      from stock_summary as sts 
      where sts.store_id = ${store_id} and month(sts.month) = ${month} and year(sts.month) = ${year}
      order by sts.month desc limit ${show} offset ${page_tab2}`;
    const count: { total_pages: string }[] =
      await prisma.$queryRaw`with total_count AS (with stock_summary as(select pv.name as variant_name, p.name as product_name, loc.address as store_address, s.address_id as store_id, 
      DATE_FORMAT(sh.created_at, '%Y-%m-01') AS month, 
      SUM(CASE WHEN sh.qty_change > 0 THEN sh.qty_change ELSE 0 END) AS total_additions,
      SUM(CASE WHEN sh.qty_change < 0 THEN ABS(sh.qty_change) ELSE 0 END) AS total_subtractions,
      SUM(CASE WHEN sh.qty_change > 0 THEN sh.qty_change ELSE 0 END) - SUM(CASE WHEN sh.qty_change < 0 THEN ABS(sh.qty_change) ELSE 0 END) AS final_qty
      from stock_history sh
      join store_stock ss on ss.id = sh.store_stock_id
      join product_variants pv on ss.variant_id = pv.id
      join products p on pv.product_id = p.id
      join stores s on ss.store_id = s.address_id
      join addresses loc on s.address_id = loc.id
      group by p.name, pv.name, month, loc.id)
      select count(*) as total from stock_summary as sts
      where sts.store_id = ${store_id} and month(sts.month) = ${month} and year(sts.month) = ${year})
      select ceil((select total from total_count) / ${show}) AS total_pages`;
    return { report, ...count[0] };
  }
}
export default new StockHistoryService();
