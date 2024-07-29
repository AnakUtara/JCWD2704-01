import prisma from '@/prisma';
import { catchAllErrors } from '@/utils/error';

export async function checkVoucherExpiry() {
  try {
    await prisma.promotion.updateMany({
      where: { AND: [{ expiry_date: { lt: new Date() } }, { is_valid: true }] },
      data: { is_valid: false },
    });
  } catch (error) {
    catchAllErrors(error);
  }
}
