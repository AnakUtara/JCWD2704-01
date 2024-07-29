import promotionController from '@/controllers/promotion.controller';
import { blobUploader } from '@/libs/multer';
import { authorizeStoreAdmin, authorizeSuperAdmin, verifyAdminAccToken } from '@/middlewares/admin.middleware';
import userMiddleware from '@/middlewares/user.middleware';
import { Router } from 'express';

class AddressRouter {
  private router: Router;
  constructor() {
    this.router = Router();
    this.initializedRoutes();
  }

  private initializedRoutes() {
    this.router.get('/v0/:promoId', userMiddleware.accessToken, promotionController.testApplyVoucher);
    // this.router.get('/user', userMiddleware.accessToken, promotionController.getCustomerVouchers);
    this.router.get('/all', promotionController.getAllValidVouchers);
    this.router.get('/user', userMiddleware.accessToken, promotionController.getUserVoucherByUserID);
    this.router.get('/featured', promotionController.getAllFeaturedPromos);
    this.router.get('/', promotionController.getAllPromotions);
    this.router.get('/users', promotionController.getAllUserVouchers);
    this.router.post('/', verifyAdminAccToken, authorizeSuperAdmin, blobUploader().single('promo_image'), promotionController.createPromotion);
    this.router.patch('/:id', verifyAdminAccToken, authorizeSuperAdmin, blobUploader().single('promo_image'), promotionController.updatePromoImage);
    this.router.delete('/:id', verifyAdminAccToken, authorizeSuperAdmin, promotionController.deletePromotion);
  }
  public getRouter() {
    return this.router;
  }
}

export default new AddressRouter();
