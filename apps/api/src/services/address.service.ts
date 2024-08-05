import prisma from '@/prisma';
import { Request } from 'express';

import { addressUpsertArgs } from '@/constants/address.constant';
import { userCreateAddress } from '@/schemas/address.schema';
import { AuthError, CustomError } from '@/utils/error';
import { userAccessArgs } from '@/constants/user.constant';
import { createToken } from '@/libs/jwt';
import { ACC_SECRET_KEY } from '@/config';

class AddressService {
  async getUserAddresses(req: Request) {
    if (!req.user) throw new AuthError('not authorized');
    const user_id = req.params.id;
    if (req.user.role == 'customer' && user_id !== req.user.id) throw new AuthError('cant access other user address');
    return await prisma.address.findMany({ where: { user_id, type: 'personal' } });
  }

  async create(req: Request) {
    const { longitude, latitude, address, details, city_id } = req.body;
    const validate = userCreateAddress.parse({
      address,
      longitude: Number(longitude),
      latitude: Number(latitude),
      ...(details && { details }),
      ...(city_id && { city_id: Number(city_id) }),
    });
    return await prisma.$transaction(async (tx) => {
      console.log(req.user?.addresses?.[0]?.city_id);
      const city = await tx.city.findFirst({ where: { city_id: validate.city_id } });
      if (!city?.city_id) throw new CustomError(`Cannot find City: ${city_id}`);
      await tx.address.upsert(
        addressUpsertArgs({
          city_id: validate.city_id ? city.city_id : (req.user?.addresses?.[0]?.city_id as number),
          user_id: req.user?.id!,
          validate,
        }),
      );
      const user = await tx.user.findFirst(userAccessArgs.first(`${req.user?.id}`));
      if (!user) throw new CustomError('Need to login');
      const { password: _password, ...data } = user;
      const accessToken = createToken({ ...data }, ACC_SECRET_KEY, '15m');
      return { accessToken };
    });
  }

  async delete(req: Request) {
    return await prisma.$transaction(async (tx) => {
      const address = await tx.address.findFirst({ where: { user_id: req.user?.id } });
      if (!address?.id) throw new CustomError("You don't have an address");
      await tx.address.delete({ where: { id: address.id } });
      const user = await tx.user.findFirst(userAccessArgs.first(`${req.user?.id}`));
      if (!user) throw new CustomError('Need to login');
      const { password: _password, ...data } = user;
      const accessToken = createToken({ ...data }, ACC_SECRET_KEY, '15m');
      return { accessToken };
    });
  }

  async get(req: Request) {
    if (!req.user) throw new CustomError('not authorized');
    return await prisma.address.findMany({ where: { id: req.user.addresses?.[0]?.id } });
  }
}

export default new AddressService();
