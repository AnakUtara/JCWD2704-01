/** @format */
import { Request } from 'express';
import { prisma } from '@/libs/prisma';
import { AuthError, BadRequestError, NotFoundError } from '@/utils/error';
import { getNearestStoreSchema } from '@/libs/zod-schemas/store.schema';
import { Prisma } from '@prisma/client';

export class StoreService {
  async getNearestStore(req: Request) {
    const { address_id } = getNearestStoreSchema.parse(req.query);
    console.log('address_id:', address_id)
    const coordinate = await prisma.address.findUnique({ where: { id: address_id }, select: { latitude: true, longitude: true } });
    console.log('coordinate:', coordinate)
    if (!coordinate || !coordinate.latitude || !coordinate.longitude) throw new BadRequestError('Address doesnt have coordinate');
    const { latitude, longitude } = coordinate;
    const result: any = await prisma.$queryRaw`
    SELECT id,
    (
      6371 * acos(
        cos(radians(${latitude})) * 
        cos(radians(latitude)) * 
        cos(radians(longitude) - radians(${longitude})) + 
        sin(radians(${latitude})) * 
        sin(radians(latitude))
      )
    ) AS distance
    FROM Addresses
    WHERE type = "store"
    ORDER BY distance
    LIMIT 1;
  `;
    console.log('result:', result);
    return result[0];
  }

  async getStoreList(req: Request) {
    if (!req.user) throw new AuthError('not authorized');
    return await prisma.store.findMany({ select: { address_id: true } });
  }

  async getStoreNamesIds(req: Request) {
    const { search_sel1 } = req.query;
    let where: Prisma.StoreWhereInput = { is_deleted: false };
    if (search_sel1)
      where.AND = {
        OR: [{ address: { address: { contains: String(search_sel1) } } }, { address: { city: { city_name: { contains: String(search_sel1) } } } }],
      };
    const data = await prisma.store.findMany({
      where,
      include: { address: { select: { address: true, id: true, city: { select: { city_name: true } } } } },
    });
    if (!data) throw new NotFoundError('Store not found.');
    return data;
  }
}
export default new StoreService();
