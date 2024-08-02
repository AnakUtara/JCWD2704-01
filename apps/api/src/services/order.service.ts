/** @format */
import { Request } from 'express';
import { prisma } from '@/libs/prisma';
import { AuthError, BadRequestError, NotFoundError } from '@/utils/error';
import { OrderStatus, Prisma } from '@prisma/client';
import { getOrderQuerySchema } from '@/libs/zod-schemas/order.schema';
import stockHistoryService from './stockHistory.service';
import { paginate } from '@/utils/pagination';

async function orderPermision(inv: string, user: Request['user'], allowUser: boolean = true, allowStoreAdmin: boolean = true) {
  if (!user) throw new AuthError();
  const orderData = await prisma.customerOrders.findUnique({
    where: { inv_no: inv },
    include: { store: { include: { store_admin: true } } },
  });
  if (!orderData) throw new NotFoundError('no order with that invoice');
  const { id, role } = user;
  if (role == 'customer' && !allowUser && id != orderData.user_id) throw new AuthError();
  if (role == 'store_admin' && !allowStoreAdmin && !orderData.store.store_admin.find((e) => e.store_id == id)) throw new AuthError();
  return { inv, user, role };
}

async function mainCancelOrder(inv_no: string) {
  let result: any;
  await prisma.$transaction(async (prisma) => {
    const data = await prisma.customerOrders.update({
      where: { inv_no, NOT: { OR: [{ status: 'sended' }, { status: 'sending' }] } },
      data: { status: 'canceled' },
      include: { order_details: { include: { store_stock: { include: { promo: true } } } } },
    });
    await stockHistoryService.stockChangeHandler(
      prisma,
      {
        changeAll: 'increment',
        reference: 'order canceled',
        list: data.order_details.map(({ store_stock_id, quantity }) => ({ id: store_stock_id, quantity })),
      },
      data.id,
    );

    await stockHistoryService.stockChangeHandler(
      prisma,
      {
        changeAll: 'increment',
        reference: 'order bonus canceled',
        list: data.order_details
          .filter(({ store_stock: { promo } }) => {
            if (promo) {
              const isBuy1Get1 = promo.type == 'buy_get';
              const isValid = data.created_at < promo.expiry_date;
              if (isBuy1Get1 && isValid) {
                return true;
              }
            }
            return false;
          })
          .map(({ store_stock_id, quantity }) => ({ id: store_stock_id, quantity })),
      },
      data.id,
    );

    result = data;
  });
  return result;
}

export class OrderService {
  async getOrderList(req: Request) {
    const { before, after, asc, store_id, pn, inv, page_tab1 } = getOrderQuerySchema.parse(req.query);
    const page = page_tab1 || 1;
    const status = req.query.status as OrderStatus | undefined;
    if (!req.user) throw new AuthError();
    const where: Prisma.CustomerOrdersWhereInput = {
      // Customer Fillter
      user_id: req.user.role == 'customer' ? req.user.id : (req.query.user_id as string | undefined),
      // Store Fillter
      store: {
        AND: [req.user.role == 'store_admin' ? { store_admin: { some: { id: req.user.id } } } : {}, { address_id: store_id }],
      },
      //invoice fillter
      inv_no: { contains: inv || '' },
      // Date Fillter
      created_at: {
        ...(before ? { lte: new Date(before) } : {}),
        ...(after ? { gte: new Date(after) } : {}),
      },
      // By Status
      status: status ? status : undefined,
      // Fillter by product
      ...(pn
        ? {
            order_details: {
              some: {
                store_stock: {
                  product: { product: { name: { contains: pn } } },
                },
              },
            },
          }
        : {}),
      //End Fillter by product
    };
    const { _count } = await prisma.customerOrders.aggregate({ _count: { id: true }, where });
    const orders = await prisma.customerOrders.findMany({
      select: { inv_no: true },
      orderBy: { created_at: asc ? 'asc' : 'desc' },
      ...paginate(20, page),
      where,
    });
    const result = { data: orders, page: { now: page, end: Math.ceil(_count.id / 20) } };
    return result;
  }

  async getOrderByInv(req: Request) {
    const { inv, user, role } = await orderPermision(`${req.params.inv}`, req.user);
    const result = await prisma.customerOrders.findUnique({
      where: {
        inv_no: inv,
        user_id: role == 'customer' ? user.id : undefined,
        ...(role == 'store_admin' && { store: { store_admin: { some: { id: user.id } } } }),
      },
      include: {
        payment_proof: { select: { name: true } },
        order_details: {
          include: {
            store_stock: {
              include: { product: { include: { product: true } } },
            },
          },
        },
        origin: true,
        user: true,
        promotion: true,
        stock_histories: role !== 'customer',
      },
    });
    if (!result) throw new NotFoundError('Order data not found');
    return result;
  }

  async uploadPaymentProof(req: Request) {
    const { inv: inv_no, role } = await orderPermision(`${req.params.inv}`, req.user);
    if (role != 'customer') throw new AuthError();
    if (!req.file) throw new BadRequestError('upload payment proof image');
    return await prisma.customerOrders.update({
      where: { inv_no, user_id: req.user?.id, expire: { gt: new Date().toISOString() } },
      data: {
        status: 'wait_for_confirmation',
        payment_proof: {
          create: {
            name: `payment-${new Date().getTime()}.${req.file.mimetype.replace('image/', '')}`,
            blob: req.file.buffer,
            type: 'payment',
          },
        },
      },
    });
  }

  async orderAutoHandler() {
    try {
      const updateTarget = await prisma.customerOrders.findMany({
        where: { status: 'wait_for_payment', expire: { lte: new Date() } },
        include: { order_details: true },
      });
      if (updateTarget.length) {
        await Promise.all(updateTarget.map(async ({ inv_no }) => await mainCancelOrder(inv_no)));
      }
      const delivered = await prisma.customerOrders.updateMany({
        where: {
          status: 'sending',
          expire: { lte: new Date() },
        },
        data: { status: 'sended' },
      });
    } catch (error) {
      console.log('ERROR: auto schedule error');
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
  }

  async approveOrderPayment(req: Request) {
    const { inv: inv_no, role } = await orderPermision(`${req.params.inv}`, req.user, false);
    if (role == 'customer') throw new AuthError();
    return await prisma.customerOrders.update({
      where: { inv_no },
      data: { status: 'process' },
    });
  }

  async sendingOrder(req: Request) {
    const { inv: inv_no } = await orderPermision(`${req.params.inv}`, req.user, false);
    return await prisma.customerOrders.update({
      where: { inv_no },
      data: { status: 'sending', expire: new Date(new Date().getTime() + 1000 * 3600 * 24 * 7) },
    });
  }
  async cancelOrder(req: Request) {
    const { inv } = await orderPermision(`${req.params.inv}`, req.user);
    return await mainCancelOrder(inv);
  }

  async orderDelivered(req: Request) {
    if (!req.user) throw new AuthError();
    const order = await prisma.customerOrders.update({
      where: { inv_no: req.params.inv, user_id: req.user.id },
      data: { status: 'sended' },
    });
    if (!order) throw new NotFoundError('order not found');
    return order;
  }
}
export default new OrderService();
