import { StoreRegisterType } from '@/schemas/store.schema';
import { Prisma } from '@prisma/client';

type StoreInputReturn = {
  address: (address: Omit<StoreRegisterType, 'name' | 'end_time' | 'selectedAdminId' | 'start_time'>) => Prisma.AddressCreateArgs;
  store: (store: { id: string }) => Prisma.StoreCreateArgs;
};

export const storeInput: StoreInputReturn = {
  address: ({ address, details, city_id, longitude, latitude }) => ({
    data: { address, details, latitude, longitude, city: { connect: { city_id } } },
  }),
  store: ({ id }) => ({
    data: { address: { connect: { id } } },
  }),
};
