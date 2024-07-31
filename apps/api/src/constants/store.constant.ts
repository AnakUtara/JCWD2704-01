import { StoreRegisterType, StoreUpdateType } from '@/schemas/store.schema';
import { Prisma } from '@prisma/client';

type StoreCreateReturn = {
  address: (address: Omit<StoreRegisterType, 'name' | 'end_time' | 'selectedAdminId' | 'start_time'>) => Prisma.AddressCreateArgs;
  store: (store: { id: string }) => Prisma.StoreCreateArgs;
};

export const storeCreate: StoreCreateReturn = {
  address: ({ address, details, city_id, longitude, latitude }) => ({
    data: {
      address,
      details,
      latitude,
      longitude,
      city: { connect: { city_id } },
    },
  }),
  store: ({ id }) => ({
    data: { address: { connect: { id } } },
  }),
};

type StoreUpdateReturn = {
  address: (payload: Omit<StoreUpdateType, 'selectedAdminId'>) => Prisma.StoreUpdateArgs;
  admin: (id: string | undefined, store_id: string | undefined) => Prisma.UserUpdateArgs;
};

export const storeUpdate: StoreUpdateReturn = {
  address: ({ address, city_id, details, latitude, longitude, address_id }) => ({
    where: { address_id },
    data: {
      ...(address && { address: { update: { address, city_id, details, latitude, longitude } } }),
    },
  }),
  admin: (id, store_id) => ({
    where: { id, is_banned: false },
    data: { store_id: store_id ? store_id : null },
  }),
};
