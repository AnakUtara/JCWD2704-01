import storeStockService from '@/services/storeStock.service';
import { EntityController } from './entity.controller';
import { Request, Response, NextFunction } from 'express';

export class StoreStockController extends EntityController {
  getStoreStockById = this.sendResponse({
    service: (req: Request) => storeStockService.getStoreStockById(`${req.params?.id}`),
    response: 'fetch product data full detail',
  });
  async getStoreStocks(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await storeStockService.getStoreStocks(req);
      res.send({ message: 'Fetched stocks data', results });
    } catch (error) {
      next(error);
    }
  }
  async getProductByStoreId(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await storeStockService.getProductByStoreId(req);
      res.send({ message: 'Fetched all products by store id.', results });
    } catch (error) {
      next(error);
    }
  }
  async getProductDetailsByStoreId(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await storeStockService.getProductDetailsByStoreId(req);
      res.send({ message: 'Fetched product details by store id', results });
    } catch (error) {
      next(error);
    }
  }

  async getProductRecommendationsByCityId(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await storeStockService.getProductRecommendationsByCityId(req);
      res.send({ message: 'Fetched product recommendations by store id', results });
    } catch (error) {
      next(error);
    }
  }
  async initStock(req: Request, res: Response, next: NextFunction) {
    try {
      await storeStockService.initStock(req);
      res.status(201).send({ message: 'Success.' });
    } catch (error) {
      next(error);
    }
  }
  async updateStock(req: Request, res: Response, next: NextFunction) {
    try {
      await storeStockService.updateStock(req);
      res.send({ message: 'Success.' });
    } catch (error) {
      next(error);
    }
  }
}
