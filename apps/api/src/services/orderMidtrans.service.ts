import { TMidtransPaymenLink } from '@/models/midtrans.model';
import prisma from '@/prisma';
import { calculateDiscount } from '@/utils/calculateDiscount';
import { AuthError, NotFoundError } from '@/utils/error';
import { createMidtransPaymenLink } from '@/utils/other-api/midtrans';
import { Request } from 'express';

export class OrderMidtransService {
  async payViaMidtrans(req: Request) {
    if (!req.user || req.user.role !== 'customer') throw new AuthError();
    const inv = String(req.params.inv);
    const o = await prisma.customerOrders.findUnique({ where: { inv_no: inv }, select: { paymentLink: true, id: true } });
    if (!o) throw new NotFoundError('Order not found');
    if (o.paymentLink) return { payment_url: o.paymentLink, order_id: o.id } as TMidtransPaymenLink;

    const order = await prisma.customerOrders.findUnique({
      where: { inv_no: inv, user_id: req.user.id },
      include: {
        user: true,
        order_details: { include: { store_stock: { include: { product: { include: { product: { include: { category: true } } } } } } } },
      },
    });
    if (!order) throw new NotFoundError('Order not found');
    const { email, full_name, phone_no } = order.user;
    if (!full_name || !phone_no) throw new AuthError('Need to fill phone number and fullname in profile to gain access midtrans transaction');

    const total =
      order.order_details.reduce((p, s) => p + s.quantity * calculateDiscount(s.unit_price, s.discount), order.shipping_cost) - order.discount;
    const allProducts = order.order_details.map((e) => ({
      id: e.store_stock_id,
      price: calculateDiscount(e.unit_price, e.discount),
      quantity: e.quantity,
      name: e.store_stock.product.product.name,
      category: e.store_stock.product.product.category.name,
    }));

    const newPaymentLink = await createMidtransPaymenLink({
      transaction_details: {
        order_id: order.id,
        gross_amount: total,
      },
      expiry: {
        start_time: order.created_at.toISOString(),
        duration: 1,
        unit: 'hours',
      },
      item_details: [
        ...allProducts,
        { name: 'Shipping Cost', quantity: 1, price: order.shipping_cost },
        { name: 'discount', quantity: 1, price: -1 * order.discount },
      ],
      customer_details: {
        email,
        phone: phone_no,
        first_name: full_name,
      },
      usage_limit: 1,
    });

    prisma.customerOrders.update({ where: { inv_no: inv }, data: { paymentLink: newPaymentLink.data.payment_url } });
    return newPaymentLink.data;
  }

  async midtransHandler(req: Request) {
    const { transaction_status, transaction_id } = req.body;
    if (transaction_status == 'capture') {
      prisma.customerOrders.update({
        where: { id: transaction_id },
        data: { status: 'process' },
      });
    }
  }
}

export default new OrderMidtransService();
