import storeManagementService from '@/services/storeManagement.service';
import { Controller } from './index.types';
import { messageResponse } from '@/utils/message';

class StoreManagementController {
  create: Controller = async (req, res, next) => {
    try {
      const data = await storeManagementService.create(req);
      console.log(data)
      res.send(messageResponse('Success created store'));
    } catch (error) {
      next(error);
    }
  };
  update: Controller = async (req, res, next) => {
    try {
      await storeManagementService.update(req);
      res.send();
    } catch (error) {
      next(error);
    }
  };
  delete: Controller = async (req, res, next) => {
    try {
      await storeManagementService.delete(req);
      res.send();
    } catch (error) {
      next(error);
    }
  };
}

export default new StoreManagementController();
