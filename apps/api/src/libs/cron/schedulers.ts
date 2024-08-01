import cron from 'node-cron';
import { checkVoucherExpiry } from './check.voucher.expiry';
import { giveFreeShipping } from './give.free-shipping.voucher';
export function checkVoucherExpiryScheduler() {
  cron.schedule('* */1 * * *', async () => {
    await checkVoucherExpiry();
  });
}

export function checkEligibleFreeShipping() {
  cron.schedule(`*/30 * * * *`, async () => {
    await giveFreeShipping();
  });
}
