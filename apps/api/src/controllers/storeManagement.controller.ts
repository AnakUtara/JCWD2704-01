import storeManagementService from '@/services/storeManagement.service';
import { Controller } from './index.types';
import { messageResponse } from '@/utils/message';

class StoreManagementController {
  getById: Controller = async (req, res, next) => {
    try {
      const store = await storeManagementService.getById(req);
      res.send({ ...store, ...messageResponse(`Success GET store id ${req.params.id}`) });
    } catch (error) {
      next(error);
    }
  };

  get: Controller = async (req, res, next) => {
    try {
      const stores = await storeManagementService.get(req);
      res.send({ ...stores, ...messageResponse('Success GET all stores') });
    } catch (error) {
      next(error);
    }
  };

  create: Controller = async (req, res, next) => {
    try {
      await storeManagementService.create(req);
      res.send(messageResponse('Success created store'));
    } catch (error) {
      next(error);
    }
  };

  update: Controller = async (req, res, next) => {
    try {
      await storeManagementService.update(req);
      res.send(messageResponse('Success created store'));
    } catch (error) {
      next(error);
    }
  };

  delete: Controller = async (req, res, next) => {
    try {
      const { id } = req.params;
      await storeManagementService.delete(req);
      res.send(messageResponse(`Success delete store ${id}`));
    } catch (error) {
      next(error);
    }
  };
}

export default new StoreManagementController();
