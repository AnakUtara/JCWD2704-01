import prisma, { userTransactionOption } from '@/prisma';
import { verify } from 'jsonwebtoken';
import type { Request } from 'express';

import { createToken } from '@/libs/jwt';
import { comparePassword, hashPassword } from '@/libs/bcrypt';
import { userAccessArgs, userCreateInput, userCreateVoucherInput, userUpdateArgs } from '@/constants/user.constant';
import { ACC_SECRET_KEY, FP_SECRET_KEY, REFR_SECRET_KEY, VERIF_SECRET_KEY } from '@/config';
import {
  userForgotSchema,
  userLoginSchema,
  userRegisterSchema,
  userUpdatePasswordSchema,
  userUpdateSchema,
  userValidationEmailSchema,
} from '@/schemas/user.schema';
import { CustomError } from '@/utils/error';
import { verifyEmail, verifyEmailFP } from '@/templates';
import { Prisma } from '@prisma/client';
import { userDataImage } from '@/constants/image.constant';

class UserService {
  async register(req: Request) {
    const file = req.file;
    const validate = userRegisterSchema.parse(req.body);
    return await prisma.$transaction(async (tx) => {
      const checkUser = await tx.user.findFirst({ where: { email: validate.email } });
      const checkPhoneNo = await tx.user.findFirst({ where: { phone_no: validate.phone_no || '' } });
      const data = await userCreateInput(validate);
      if (checkUser) throw new CustomError('Email address is already associated with an existing account in the system.');
      if (checkPhoneNo) throw new CustomError('Phone Number is already associated with an existing account in the system.');
      if (validate.referrence_code) {
        const checkCode = await tx.user.findFirst({ where: { referral_code: validate.referrence_code } });
        if (!checkCode) throw new CustomError('Referral invalid');
        data.reference_code = validate.referrence_code;
      }
      const user = await tx.user.create({ data });
      const registerToken = createToken({ id: user.id }, VERIF_SECRET_KEY, '15m');
      if (file) await tx.image.create({ data: await userDataImage(file, 'avatar', user) });
      if (file) await tx.image.create({ data: await userDataImage(file, 'avatar', user) });
      await verifyEmail(
        { full_name: user.full_name ? user.full_name : 'Farmers', token: registerToken, subject: 'Farm2Door - Verification Email' },
        user.email,
      );
    }, userTransactionOption);
  }

  async verification(req: Request) {
    const { token } = req.params as { token: string };
    const { id } = verify(token, VERIF_SECRET_KEY) as { id: string };
    return await prisma.$transaction(async (tx) => {
      const user = await tx.user.findFirst({ where: { id }, include: { promotions: true } });
      if (!user) throw new CustomError('Invalid data');
      if (user.is_verified) throw new CustomError("You're already verified");
      if (user.reference_code && !user.promotions.length) await tx.promotion.create({ data: userCreateVoucherInput(user) });
      await tx.user.update({ where: { id }, data: { is_verified: true } });
      if (user.reference_code && !user.promotions.length) await tx.promotion.create({ data: userCreateVoucherInput(user) });
      await tx.user.update({ where: { id }, data: { is_verified: true } });
    }, userTransactionOption);
  }

  async login(req: Request) {
    const { email, password } = userLoginSchema.parse(req.body);
    const user = await prisma.user.findUnique(userAccessArgs.unique(email));
    if (!user?.password)
      throw new CustomError("We're sorry, the email address you entered is not registered in our system.", {
        cause: 'Please double-check the email address you entered and make sure there are no typos.',
      });

    const checkPassword = await comparePassword(user.password, password);
    if (!checkPassword) throw new CustomError('Wrong password');
    if (!user.is_verified) throw new CustomError('Need to verify your account', { cause: 'Check your email for furthure access' });
    if (user?.role !== 'customer') throw new CustomError('This session is only for users!');
    if (user.is_banned) throw new CustomError("You're already BAN!", { cause: 'plase contact our Email or Customer Service for information' });
    if (!user.is_verified) throw new CustomError('Need to verify your account', { cause: 'Check your email for furthure access' });
    if (user?.role !== 'customer') throw new CustomError('This session is only for users!');
    if (user.is_banned) throw new CustomError("You're already BAN!", { cause: 'plase contact our Email or Customer Service for information' });
    const { password: _password, ...data } = user;
    const refreshToken = createToken({ id: user.id }, REFR_SECRET_KEY, '30d');
    const accessToken = createToken({ ...data }, ACC_SECRET_KEY, '15m');
    return { accessToken, refreshToken };
  }

  async authorization(req: Request) {
    return await prisma.$transaction(async (tx) => {
      const user = await tx.user.findFirst(userAccessArgs.first(`${req.user?.id}`));
      if (!user) throw new CustomError('Need to login');
      const { password: _password, ...data } = user;
      const accessToken = createToken({ ...data }, ACC_SECRET_KEY, '15m');
      return { accessToken };
    }, userTransactionOption);
  }

  async update(req: Request) {
    const file = req.file;
    const validate = userUpdateSchema.parse({
      ...(req.body.full_name && { full_name: req.body.full_name }),
      ...(req.body.phone_no && { phone_no: req.body.phone_no }),
      ...(req.body.dob && { dob: req.body.dob }),
    });

    return await prisma.$transaction(async (tx) => {
      const findUnique = await tx.user.findFirst({ where: { phone_no: validate.phone_no } });
      if (findUnique?.phone_no === validate.phone_no) throw new CustomError('Phone Number is already exist');
      const user = await tx.user.update(userUpdateArgs({ id: `${req.user?.id}`, validate }));
      if (file) {
        if (!user.avatar_id) {
          await tx.image.create({
            data: await userDataImage(file, 'avatar', user),
          });
        } else {
          await tx.image.update({
            where: { id: user.avatar_id },
            data: await userDataImage(file, 'avatar'),
          });
        }
      }

      const { password: _password, ...data } = user;
      return { accessToken: createToken({ ...data }, ACC_SECRET_KEY, '15m') };
    }, userTransactionOption);
  }

  async updatePassword(req: Request) {
    const { password, newPassword } = userUpdatePasswordSchema.parse(req.body);
    const { id } = req.user!;
    if (password.toLowerCase() === newPassword.toLowerCase()) throw new CustomError('Password cannot be the same as the new password');
    return await prisma.$transaction(async (tx) => {
      const user = await tx.user.findFirst({ where: { id } });
      if (!user?.password) throw new CustomError('Invalid Id, Cannot find any user');
      const isValidPassword = await comparePassword(user.password, password);
      const newHashPassword = await hashPassword(newPassword);
      if (!isValidPassword) throw new CustomError('Invalid current password');
      const update = await tx.user.update({
        where: { id: user.id },
        data: { password: newHashPassword },
      });
      const { password: _password, ...data } = update;
      return { accessToken: createToken({ ...data }, ACC_SECRET_KEY, '15m') };
    }, userTransactionOption);
  }

  async forgetPassword(req: Request) {
    const { password } = userForgotSchema.parse(req.body);
    const { token: FPToken } = req.params as { token: string };
    return await prisma.$transaction(async (tx) => {
      const { id } = verify(FPToken, FP_SECRET_KEY) as { id: string };
      if (!id) throw new CustomError('Need to verify email');
      await tx.user.update({ where: { id }, data: { password: await hashPassword(password) } });
    }, userTransactionOption);
  }

  async forgetPasswordVerification(req: Request) {
    const { email } = userValidationEmailSchema.parse(req.body);
    return await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { email } });
      if (!user) throw new CustomError('Cannot found your Email');
      const resetToken = createToken({ id: user.id }, FP_SECRET_KEY, '1d');
      await tx.user.update({ where: { id: user.id }, data: { reset_token: resetToken } });
      await verifyEmailFP(
        { full_name: user.full_name ? user.full_name : 'Farmers', token: resetToken, subject: 'Farm2Door - Verification Email' },
        user.email,
      );
    });
  }
}

export default new UserService();
