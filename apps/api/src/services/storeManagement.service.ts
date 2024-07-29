import { storeInput } from '@/constants/store.constant';
import prisma from '@/prisma';
import { storeRegisterSchema } from '@/schemas/store.schema';
import { CustomError } from '@/utils/error';
import { Request } from 'express';

class StoreManagementService {
  async create(req: Request) {
    console.log(req.body);
    const validate = storeRegisterSchema.safeParse(req.body);
    if (!validate.success) throw new CustomError('Not validated');
    return await prisma.$transaction(async (tx) => {
      const { address, details, city_id, longitude, latitude, selectedAdminId } = validate.data;
      const add = await tx.address.create(storeInput.address({ address, city_id, details, latitude, longitude }));
      const store = await tx.store.create(storeInput.store({ id: add.id }));

      for (const id of selectedAdminId) {
        await tx.user.update({
          where: { id, role: 'store_admin' },
          data: { store_id: store.address_id },
        });
      }
    });
  }
  async update(req: Request) {}
  async delete(req: Request) {}
}

export default new StoreManagementService();
