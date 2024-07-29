import promotionService from '@/services/promotion.service';
import { EntityController } from './entity.controller';
import { NextFunction, Request, Response } from 'express';

class PromotionController extends EntityController {
  testApplyVoucher = this.sendResponse({
    service: promotionService.testApplyVoucher,
    response: 'fetch apply voucher result',
  });

  getCustomerVouchers = this.sendResponse({
    service: promotionService.getCustomerVouchers,
    response: 'fetch vouchers',
  });
  async createPromotion(req: Request, res: Response, next: NextFunction) {
    try {
      await promotionService.createPromotion(req);
      res.status(201).send({ message: 'Success' });
    } catch (error) {
      next(error);
    }
  }
  async getUserVoucherByUserID(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await promotionService.getUserVouchersByUserID(req);
      res.send({ message: 'Fetch all user owned vouchers', result });
    } catch (error) {
      next(error);
    }
  }
  async getAllValidVouchers(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await promotionService.getAllValidPromos(req);
      res.send({ message: 'Fetch all valid vouchers', result });
    } catch (error) {
      next(error);
    }
  }
  async getAllFeaturedPromos(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await promotionService.getAllFeaturedPromos(req);
      res.send({ message: 'Fetched all featured promos', result });
    } catch (error) {
      next(error);
    }
  }
  async updatePromoImage(req: Request, res: Response, next: NextFunction) {
    try {
      await promotionService.updatePromoImage(req);
      res.send({ message: 'Success' });
    } catch (error) {
      next(error);
    }
  }
  async deletePromotion(req: Request, res: Response, next: NextFunction) {
    try {
      await promotionService.deletePromotion(req);
      res.send({ message: 'Success' });
    } catch (error) {
      next(error);
    }
  }
  async getAllPromotions(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await promotionService.getAllPromotions(req);
      res.send({ message: 'Fetched all promotions.', results });
    } catch (error) {
      next(error);
    }
  }
  async getAllUserVouchers(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await promotionService.getAllUserVouchers(req);
      res.send({ message: "Fetched all user's vouchers.", results });
    } catch (error) {
      next(error);
    }
  }
}

export default new PromotionController();
