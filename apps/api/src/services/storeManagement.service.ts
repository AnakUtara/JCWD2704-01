import { storeCreate, storeUpdate } from '@/constants/store.constant';
import prisma from '@/prisma';
import { storeRegisterSchema, storeUpadteSchema } from '@/schemas/store.schema';
import { CustomError } from '@/utils/error';
import { countTotalPage, paginate } from '@/utils/pagination';
import { Prisma } from '@prisma/client';
import { Request } from 'express';

class StoreManagementService {
  private include: Prisma.StoreInclude = {
    address: { include: { city: true } },
    store_admin: { omit: { password: true } },
    product_stock: { include: { product: { include: { product: true, images: { select: { name: true } } } } } },
  };

  async getById(req: Request) {
    const { id: address_id } = req.params;
    return await prisma.store.findFirst({
      where: { address_id, is_deleted: false },
      include: this.include,
    });
  }

  async get(req: Request) {
    const { page_tab1, search } = req.query;
    const where: Prisma.StoreWhereInput = {
      is_deleted: false,
      ...(search && {
        address: { city: { city_name: { contains: String(search).trim() } } },
      }),
    };

    const stores = await prisma.store.findMany({
      include: this.include,
      where,
      ...paginate(10, Number(page_tab1)),
    });
    const totalPage = await prisma.store.count();
    return { stores, totalPage: countTotalPage(totalPage, 10) };
  }

  async create(req: Request) {
    const validate = storeRegisterSchema.safeParse(req.body);
    if (!validate.success) throw new CustomError('Not validated');
    return await prisma.$transaction(async (tx) => {
      const { address, details, city_id, longitude, latitude, selectedAdminId } = validate.data;
      const add = await tx.address.create(storeCreate.address({ address, city_id, details, latitude, longitude }));
      const store = await tx.store.create(storeCreate.store({ id: add.id }));
      for (const id of selectedAdminId) {
        await tx.user.update({
          where: { id, role: 'store_admin' },
          data: { store_id: store.address_id },
        });
      }
    });
  }

  async update(req: Request) {
    const validate = storeUpadteSchema.safeParse(req.body);
    if (!validate.success) {
      const errors = validate.error.issues.reduce((acc: { [key: string]: string }, issue) => {
        acc[issue.path[0] as string] = issue.message;
        return acc;
      }, {});
      return errors;
    }
    return await prisma.$transaction(async (tx) => {
      if (validate.data.address_id) await tx.store.update(storeUpdate.address(validate.data));
      if (validate.data.storeAdmin) {
        const { storeAdmin } = validate.data;
        for (const admin of storeAdmin) {
          const { id, address_id } = admin;
          if (!admin.address_id) {
            await tx.user.update({
              where: { id, is_banned: false },
              data: { store: { disconnect: true } },
            });
          } else {
            await tx.user.update({
              where: { id, is_banned: false },
              data: { store: { connect: { address_id } } },
            });
          }
        }
      }
    });
  }

  async delete(req: Request) {
    const { id: address_id } = req.params;
    console.log(req.body);
    if (req.user?.role !== 'super_admin') throw new CustomError('Access denied');
    return await prisma.store.update({ where: { address_id }, data: { is_deleted: true } });
  }
}

export default new StoreManagementService();
