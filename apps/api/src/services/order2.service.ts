/** @format */
import { Request } from 'express';
import { prisma } from '@/libs/prisma';
import { invGenerate } from '@/utils/invGenerate';
import { z } from 'zod';
import { createOrderSchema, rajaOngkirCostQuerySchema } from '@/libs/zod-schemas/order.schema';
import { AuthError, BadRequestError } from '@/utils/error';
import stockHistoryService from './stockHistory.service';
import storeStockService from './storeStock.service';
import { getShipCost } from '@/utils/other-api/getShipCost';
import promotionService from './promotion.service';
import { calculateDiscount } from '@/utils/calculateDiscount';
import { Prisma } from '@prisma/client';

export class Order2Service {
  async getShipCost(req: Request) {
    return getShipCost(rajaOngkirCostQuerySchema.parse(req.query));
  }

  async createOrder(req: Request) {
    const { destination_id, promotion_id, store_id, req_products, courier, courier_service } = req.body as z.infer<typeof createOrderSchema>;
    if (!req.user || req.user.role !== 'customer') throw new AuthError('Not Authorized');
    const user_id = req.user.id;
    // get product data
    const products = await Promise.all(
      req_products.map(async ({ id, quantity }, i) => {
        const productData = await storeStockService.getStoreStockById(id);
        return { quantity, productData };
      }),
    );
    if (!products.every((e) => e.productData.store_id == store_id)) throw new BadRequestError('there is product from different store');
    //get destination and origin id
    const origin = await prisma.address.findUnique({
      where: { id: store_id },
    });
    if (!origin) throw new BadRequestError('Invalid Store ID');

    const destination = await prisma.address.findUnique({
      where: { id: destination_id },
    });
    if (!destination) throw new BadRequestError('Invalid User Address ID');

    const rajaOngkirParam = {
      origin: store_id,
      destination: destination_id,
      courier,
      weight: products.reduce((p, s) => p + s.quantity * s.productData.product.weight, 0),
    };

    const shipping_cost = (await getShipCost(rajaOngkirParam as any)).rajaongkir.results[0]?.costs.find((e) => e.service == courier_service)?.cost[0]
      ?.value;
    if (!shipping_cost) throw new BadRequestError('Invalid courier_service');

    //Promotion Logic
    const totalPrice = products.reduce(
      (p, { quantity, productData }) => p + quantity * calculateDiscount(productData.unit_price, productData.discount),
      0,
    );
    const discount = !promotion_id
      ? 0
      : await promotionService.applyVocher({
          shipCost: shipping_cost,
          total: totalPrice,
          promoId: promotion_id,
        });

    //End Promotion Logic

    const order_details: Prisma.OrderDetailCreateNestedManyWithoutTransactionInput = {
      create: products.map<Prisma.OrderDetailCreateManyTransactionInput>((e, i) => ({
        discount: e.productData.discount,
        unit_price: e.productData.unit_price,
        quantity: e.quantity,
        store_stock_id: e.productData.id,
      })),
    };

    let result: any;
    await prisma.$transaction(
      async (prisma) => {
        try {
          // copy address
          const destination_id = (
            await prisma.address.create({
              data: {
                ...{ ...destination, user_id: undefined, id: undefined },
                type: 'origin',
              },
              select: { id: true },
            })
          ).id;

          const origin_id = (
            await prisma.address.create({
              data: { ...origin, id: undefined, type: 'origin' },
              select: { id: true },
            })
          ).id;
          // Create order
          const order = await prisma.customerOrders.create({
            include: { order_details: true },
            data: {
              expire: new Date(new Date().getTime() + 1000 * 3600).toISOString(),
              user_id: user_id,
              inv_no: invGenerate(user_id),
              shipping_cost,
              promotion_id,
              discount,
              store_id,
              destination_id,
              origin_id,
              order_details,
            },
          });
          result = order;
          console.log('create history');
        } catch (error) {
          result = error;
        }

        // Create History & Change Stock
        await stockHistoryService.stockChangeHandler(
          prisma,
          {
            changeAll: 'decrement',
            reference: 'product ordered',
            list: req_products,
          },
          result.id,
        );

        //Buy1Get1
        await Promise.all(req_products.map(async ({ id, quantity }) => await promotionService.appyBuy1Get1(prisma, id, quantity, result.id)));
      },
      { isolationLevel: 'Serializable' },
    );

    if (result instanceof Error) throw new Error(result.message);
    return { ...result, total: totalPrice - discount };
  }

  async confirmPayment(req: Request) {
    if (req.user?.role == 'customer') throw new AuthError('user not authorized');
    const { store_id, inv_no } = req.body;
    return await prisma.customerOrders.update({
      where: {
        inv_no,
        image_id: { not: null },
        store: {
          address_id: store_id,
          store_admin: { some: { id: req.user?.id } },
        },
      },
      data: {
        status: 'process',
      },
    });
  }
}
export default new Order2Service();
