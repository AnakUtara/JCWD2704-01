import { NextFunction, Request, Response } from 'express';
import adminAuthService from '@/services/admin.auth.service';
import { Role } from '@prisma/client';
import { cookiesOpt } from '@/utils/cookiesOpt';

export class AdminAuthController {
  async adminLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const { accessToken, refreshToken } = (await adminAuthService.adminLogin(req)) as {
        accessToken: string;
        refreshToken: string;
      };
      res.cookie('access_token', accessToken, cookiesOpt).cookie('refresh_token', refreshToken, cookiesOpt).send({ message: 'login success' });
    } catch (error) {
      next(error);
    }
  }
  async validateAdminRefreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { accessToken, role, isVerified } = (await adminAuthService.validateAdminRefreshToken(req)) as {
        accessToken: string;
        role: Role;
        isVerified: boolean;
      };
      res.send({ message: 'success', role, accessToken, isVerified });
    } catch (error) {
      next(error);
    }
  }
}
