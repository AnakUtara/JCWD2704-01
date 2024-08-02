import { CORS_URL } from '@/config';
import { CookieOptions } from 'express';

export const cookiesOpt: CookieOptions = {
  sameSite: 'strict',
  secure: true,
  domain: CORS_URL,
};
