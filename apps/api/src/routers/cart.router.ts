import { CartController } from '@/controllers/cart.controller';
import { deleteCartSchema, upsertCartSchema } from '@/libs/zod-schemas/cart.schema';
import { verifyAdminAccToken } from '@/middlewares/admin.middleware';
import userMiddleware from '@/middlewares/user.middleware';
import { zod } from '@/middlewares/zod';
import { NextFunction, Request, Response, Router } from 'express';

class CartRouter {
  private router: Router;
  private controller = new CartController();

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', userMiddleware.accessToken, this.controller.getCartByUserId);

    this.router.get('/count', this.controller.getCountCart);

    this.router.post('/', zod(upsertCartSchema), this.controller.upsetCart);

    this.router.delete('/', zod(deleteCartSchema), this.controller.deleteFromCart);
  }

  getRouter(): Router {
    return this.router;
  }
}

export default new CartRouter();
