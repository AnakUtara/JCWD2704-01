import { Prisma, Role } from '@prisma/client';
import { Request } from 'express';
import { addressFindMany } from './address.args';

export function userFindMany(role: Role, req: Request): Prisma.UserFindManyArgs {
  const { search } = req.query;
  const where: Prisma.UserWhereInput = { role, AND: { is_banned: false } };
  if (search)
    where.AND = {
      ...where.AND,
      OR: [
        { full_name: { contains: String(search) } },
        { email: { contains: String(search) } },
        { addresses: { every: { address: { contains: String(search) } } } },
        { addresses: { every: { city: { city_name: { contains: String(search) } } } } },
      ],
    };
  return {
    where,
    orderBy: { created_at: 'desc' },
    include: {
      addresses: { include: { city: true } },
      store: { include: { address: { include: { city: true } } } },
    },
    omit: {
      password: true,
    },
  };
}

export const adminOmit: Prisma.UserOmit = {
  avatar_id: true,
  reset_token: true,
  referral_code: true,
  reference_code: true,
  // voucher_id: true,
};

export function adminFindFirst(req: Request): Prisma.UserFindFirstArgs {
  const { email } = req.body;
  return {
    where: {
      email,
      AND: {
        OR: [{ role: Role.super_admin }, { role: Role.store_admin }],
      },
    },
    include: {
      addresses: true,
      store: true,
    },
    omit: adminOmit,
  };
}
