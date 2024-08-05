import { Address, User } from '@prisma/client';
import { TUser } from './user.model';
import { TAddress } from './address.model';
import { TStoreStock } from './store.model';

export type UserType = Omit<User & { addresses?: Address[] | null }, 'password'>;

declare global {
  namespace Express {
    interface Request {
      user: UserType | null;
      store_admin: TUser | null;
      store_admin_address: TAddress | null;
      currentStock: TStoreStock | null;
      storeStock: TStoreStock | null;
    }
  }
}
