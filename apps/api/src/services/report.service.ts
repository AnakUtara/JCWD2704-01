import { getSalesReportSchema } from '@/libs/zod-schemas/order.schema';
import prisma from '@/prisma';
import { AuthError } from '@/utils/error';
import { Prisma } from '@prisma/client';
import { Request } from 'express';

class ReportService {
  async getSalesReport(req: Request) {
    const { page_tab1, store_id, category_id, month, year } = req.query;
    const show = 10;
    const report = await prisma.$queryRaw`with sales_summary as(
      select p.name as product_name, pv.name as variant_name, c.id as category_id, c.name as category,
      loc.address as store_address, s.address_id as store_id, 
      SUM(od.unit_price - (od.unit_price * od.discount/100) * od.quantity - co.discount + co.shipping_cost) 
      as total_sales, DATE_FORMAT(co.created_at, '%Y-%m-01') 
      AS month from customer_orders co 
      join order_details od on od.transaction_id = co.id 
      join store_stock ss on od.store_stock_id = ss.id 
      join product_variants pv on ss.variant_id = pv.id
      join products p on pv.product_id = p.id
      join categories c on c.id = p.category_id
      join stores s on ss.store_id = s.address_id
      join addresses loc on s.address_id = loc.id
      where co.status = "sended" group by month, c.name, p.name, pv.name, month, loc.id)
      select * from sales_summary sss where month(sss.month) = ${month} 
      and year(sss.month) = ${year} and sss.category_id = ${category_id} 
      and sss.store_id = ${store_id}
      order by sss.month desc limit ${show} offset ${Number(page_tab1) - 1};`;
    const count: { total_pages: string }[] = await prisma.$queryRaw`
      with total_count AS (
        with sales_summary as(
          select p.name as product_name, pv.name as variant_name, c.id as category_id, c.name as category,
          loc.address as store_address, s.address_id as store_id, 
          SUM(od.unit_price - (od.unit_price * od.discount/100) * od.quantity - co.discount + co.shipping_cost) 
          as total_sales, DATE_FORMAT(co.created_at, '%Y-%m-01') 
          AS month from customer_orders co 
          join order_details od on od.transaction_id = co.id 
          join store_stock ss on od.store_stock_id = ss.id 
          join product_variants pv on ss.variant_id = pv.id
          join products p on pv.product_id = p.id
          join categories c on c.id = p.category_id
          join stores s on ss.store_id = s.address_id
          join addresses loc on s.address_id = loc.id
          where co.status = "sended" group by month, c.name, p.name, pv.name, month, loc.id
        ) select count(*) as total from sales_summary sss 
        where month(sss.month) = ${month} 
        and year(sss.month) = ${year} and sss.category_id = ${category_id} 
        and sss.store_id = ${store_id}
      )
      select ceil((select total from total_count) / ${show}) AS total_pages;`;
    return { report, ...count[0] };
  }
  async getStockReport(req: Request) {
    if (!req.user) throw new AuthError();
    const { id, role } = req.user;
    if (role == 'customer') throw new AuthError();
    const where: Prisma.CustomerOrdersWhereInput = {};
  }
}

export default new ReportService();
