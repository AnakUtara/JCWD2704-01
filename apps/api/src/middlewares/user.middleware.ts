import { verify } from 'jsonwebtoken';
import type { NextFunction, Request, Response } from 'express';

import { ACC_SECRET_KEY, FP_SECRET_KEY, REFR_SECRET_KEY } from '@/config';
import type { UserType } from '@/models/global';
import { CustomError } from '@/utils/error';

class UserMiddleware {
  async accessToken(req: Request, _res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '') || '';
      req.user = verify(token, ACC_SECRET_KEY) as UserType;
      next();
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, _res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '') || '';
      req.user = verify(token, REFR_SECRET_KEY) as UserType;
      next();
    } catch (error) {
      next(error);
    }
  }

  async resetToken(req: Request, _res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '') || '';
      const verifiedToken = verify(token, FP_SECRET_KEY) as { id: string };
      if (!verifiedToken.id) throw new CustomError('Expired session');

      next();
    } catch (error) {
      next(error);
    }
  }
}

export default new UserMiddleware();
