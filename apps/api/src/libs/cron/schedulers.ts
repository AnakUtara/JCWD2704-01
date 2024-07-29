import cron from 'node-cron';
import { checkVoucherExpiry } from './check.voucher.expiry';
export function checkVoucherExpiryScheduler() {
  cron.schedule('* */1 * * *', () => {
    checkVoucherExpiry();
  });
}
