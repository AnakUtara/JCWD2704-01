import { ACC_SECRET_KEY, REFR_SECRET_KEY } from '@/config';
import { hashPassword } from '@/libs/bcrypt';
import { addressSchema, addressUpdateSchema, storeAdminSchema, storeAdminUpdateSchema } from '@/libs/zod-schemas/store-admin.schema';
import { TAddress } from '@/models/address.model';
import { TUser } from '@/models/user.model';
import prisma from '@/prisma';
import { AuthError, BadRequestError, InvalidDataError } from '@/utils/error';
import { adminFindFirst } from '@/libs/prisma/user.args';
import { reqBodyReducer } from '@/utils/req.body.helper';
import { Role } from '@prisma/client';
import { compare } from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { ZodError } from 'zod';
import { UserType } from '@/models/global';

export async function verifyAdminPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { password } = req.body;
    const isAdminExist = await prisma.user.findFirst(adminFindFirst(req));
    if (!isAdminExist) throw new InvalidDataError('Invalid email/password!');
    if (isAdminExist.role === Role.customer) throw new AuthError('Unauthorized Access.');
    const comparePassword: boolean | null = isAdminExist && (await compare(password, isAdminExist.password || ''));
    if (!comparePassword) throw new InvalidDataError('Invalid Password!');
    const { store_id, ...admin } = isAdminExist;
    req.user = { ...admin, ...(admin.role === 'store_admin' && { store_id }) } as UserType;
    next();
  } catch (error) {
    next(error);
  }
}

export async function isAdminExist(req: Request, res: Response, next: NextFunction) {
  const { email, phone_no } = req.body;
  try {
    const isAdminExist = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone_no }],
      },
    });
    if (isAdminExist) throw new BadRequestError('Email/phone number already exist.');
    next();
  } catch (error) {
    next(error);
  }
}

export async function verifyAdminAccToken(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.header('Authorization')?.split(' ')[1] || '';
    const verifiedAdmin = verify(token, ACC_SECRET_KEY);
    if (!token || !verifiedAdmin) throw new AuthError('Unauthorized access');
    req.user = verifiedAdmin as UserType;
    next();
  } catch (error) {
    next(error);
  }
}

export async function verifyAdminRefreshToken(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.split(' ')[1] || '';
    const verifiedAdminID = verify(token, REFR_SECRET_KEY);
    if (!token || !verifiedAdminID) throw new AuthError('Unauthorized access');
    req.user = verifiedAdminID as UserType;
    next();
  } catch (error) {
    next(error);
  }
}

export async function authorizeSuperAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.user?.role !== Role.super_admin) throw new AuthError('Unauthorized access to super admin privileges.');
    next();
  } catch (error) {
    next(error);
  }
}

export async function authorizeStoreAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.user?.role === Role.customer) throw new AuthError('Unauthorized access to admin privileges.');
    next();
  } catch (error) {
    next(error);
  }
}

export async function validateStoreAdminDetails(req: Request, res: Response, next: NextFunction) {
  try {
    const details = { ...req.body };
    delete details.address;
    delete details.city_id;
    delete details.details;
    const validate = storeAdminSchema.safeParse(details);
    if (!validate.success) throw new ZodError(validate.error.errors);
    validate.data.password = await hashPassword(validate.data.password);
    req.store_admin = {
      ...validate.data,
      dob: new Date(validate.data.dob),
      role: Role.store_admin,
      is_verified: true,
      store_id: !validate.data.store_id ? null : validate.data.store_id,
    };
    next();
  } catch (error) {
    next(error);
  }
}

export async function validateStoreAdminAddress(req: Request, res: Response, next: NextFunction) {
  try {
    const { address, city_id, details } = req.body;
    const storeAdminAddress = { address, city_id: Number(city_id), details };
    const validateAddress = addressSchema.safeParse(storeAdminAddress);
    if (!validateAddress.success) throw new ZodError(validateAddress.error.errors);
    req.store_admin_address = validateAddress.data as TAddress;
    next();
  } catch (error) {
    next(error);
  }
}

export async function validateStoreAdminUpdateDetails(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.body.password) req.body.password = await hashPassword(req.body.password);
    if (req.body.dob) req.body.dob = new Date(req.body.dob);
    const details = { ...req.body };
    delete details.address;
    delete details.city_id;
    delete details.details;
    const data = reqBodyReducer(details);
    const validate = storeAdminUpdateSchema.safeParse(data);
    if (!validate.success) throw new ZodError(validate.error.errors);
    req.store_admin = validate.data as TUser;
    next();
  } catch (error) {
    next(error);
  }
}

export async function validateStoreAdminUpdateAddress(req: Request, res: Response, next: NextFunction) {
  try {
    const { address, city_id, details } = req.body;
    const storeAdminAddress = { address, city_id: Number(city_id), details };
    const data = reqBodyReducer(storeAdminAddress);
    const validate = addressUpdateSchema.safeParse(data);
    if (!validate.success) throw new ZodError(validate.error.errors);
    req.store_admin_address = validate.data as TAddress;
    next();
  } catch (error) {
    next(error);
  }
}
