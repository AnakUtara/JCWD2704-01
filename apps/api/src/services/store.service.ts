import { Request } from 'express';
import prisma from '@/prisma';
import { AuthError, BadRequestError, NotFoundError } from '@/utils/error';
import { getNearestStoreSchema } from '@/libs/zod-schemas/store.schema';
import { Prisma } from '@prisma/client';

export class StoreService {
  async getNearestStore(req: Request) {
    const { address_id } = getNearestStoreSchema.parse(req.query);
    const coordinate = await prisma.address.findUnique({ where: { id: address_id }, select: { latitude: true, longitude: true } });
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
    FROM addresses
    WHERE type = "store"
    ORDER BY distance
    LIMIT 1;
  `;
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

  async getStoreByCityId(req: Request) {
    const { city_id } = req.params;
    const data = await prisma.store.findFirst({
      where: { address: { city_id: Number(city_id) } },
      include: { address: { select: { address: true, id: true, city: { select: { city_name: true } } } } },
    });
    return data;
  }
}
export default new StoreService();
