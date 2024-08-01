import prisma from '@/prisma';
import { catchAllErrors } from '@/utils/error';
import { add } from 'date-fns';

export async function giveFreeShipping() {
  try {
    await prisma.$transaction(async (prisma) => {
      const orderCounts = await prisma.customerOrders.groupBy({
        by: 'user_id',
        _count: { user_id: true },
        where: { status: 'sended', user: { promotions: { some: { NOT: { type: 'free_shipping', is_valid: true } } } } },
      });
      for (let orderCount of orderCounts) {
        if (orderCount._count.user_id > 5)
          await prisma.promotion.create({
            data: {
              title: 'Free Shipping Voucher',
              description: 'Selamat anda mendapatkan gratis ongkir untuk pembelanjaan selanjutnya! Ayo segera dipakai sebelum masa berlaku habis.',
              amount: 0,
              min_transaction: 50000,
              user: { connect: { id: orderCount.user_id } },
              type: 'free_shipping',
              is_valid: true,
              expiry_date: add(new Date(), { months: 3 }),
            },
          });
      }
    });
  } catch (error) {
    catchAllErrors(error);
  }
}
