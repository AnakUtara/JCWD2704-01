import cartService from '@/services/cart.service';
import { EntityController } from './entity.controller';
import { cookiesOpt } from '@/utils/cookiesOpt';
import { messageResponse } from '@/utils/message';

export class CartController extends EntityController {
  getCartByUserId = this.sendResponse({
    service: cartService.getCartByUserId,
    response: 'fetch cart',
  });
  getCountCart = this.sendResponse({
    service: cartService.getCountCart,
    response: 'fetch cart',
  });

  upsetCart = this.sendResponse({
    response: ({ res, data }) => {
      const { accessToken } = data;
      console.log(accessToken)
      res.cookie('access_token', accessToken, cookiesOpt).send(messageResponse('Cart updated'));
    },
    service: cartService.upsertCart,
  });

  deleteFromCart = this.sendResponse({
    response: 'success remove product from cart',
    service: cartService.deleteProductInCart,
  });
}
