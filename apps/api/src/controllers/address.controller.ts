import { EntityController } from './entity.controller';
import addressService from '@/services/address.service';
import { Controller } from './index.types';
import { messageResponse } from '@/utils/message';
import { cookiesOpt } from '@/utils/cookiesOpt';

class AddressController extends EntityController {
  getUserAddresses = this.sendResponse({
    service: addressService.getUserAddresses,
    response: 'fetch user addresses',
  });

  create: Controller = async (req, res, next) => {
    try {
      const { accessToken } = await addressService.create(req);
      res.cookie('access_token', accessToken, cookiesOpt).send({ ...messageResponse('Success Create your Address') });
    } catch (error) {
      next(error);
    }
  };

  delete: Controller = async (req, res, next) => {
    try {
      const {accessToken} = await addressService.delete(req);
      res.cookie('access_token', accessToken, cookiesOpt).send(messageResponse('Success delete your Address'));
    } catch (error) {
      next(error);
    }
  };

  get: Controller = async (req, res, next) => {
    try {
      const addresses = await addressService.get(req);
      res.send({ addresses, ...messageResponse('Success GET Address') });
    } catch (error) {
      next(error);
    }
  };
}

export default new AddressController();
