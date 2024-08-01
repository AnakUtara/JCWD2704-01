import storeService from '@/services/store.service';
import { EntityController } from './entity.controller';
import { NextFunction, Request, Response } from 'express';

export class StoreController extends EntityController {
  getNearestStore = this.sendResponse({
    service: storeService.getNearestStore,
    response: 'fetch nearest store',
  });

  getStoreList = this.sendResponse({
    service: storeService.getStoreList,
    response: 'fetch store list',
  });

  async getStoreNamesIds(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await storeService.getStoreNamesIds(req);
      res.send({ message: 'Fetched all store names & ids', results });
    } catch (error) {
      next(error);
    }
  }
  async getStoreByCityId(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await storeService.getStoreByCityId(req);
      res.send({ message: 'Fetched store by city id.', results });
    } catch (error) {
      next(error);
    }
  }
}
export default new StoreController();
