import { Prisma, PrismaClient } from '@prisma/client';

export const userTransactionOption = {
  maxWait: 5000,
  timeout: 10000,
  isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
};

export default new PrismaClient({
  log: [
    // 'query',
    // 'info',
    // 'warn',
    'error',
  ],
});
