import { CORS_URL } from '@/config';
import { CookieOptions } from 'express';

export const cookiesOpt: CookieOptions = {
  sameSite: 'strict',
  secure: true,
  domain: CORS_URL,
};

export const cookiesHTTPOnlyOpt: CookieOptions = {
  sameSite: 'strict',
  secure: true,
  httpOnly: true,
  domain: CORS_URL,
};
