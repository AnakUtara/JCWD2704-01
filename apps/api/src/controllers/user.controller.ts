import { Controller } from './index.types';
import { messageResponse } from '@/utils/message';
import userService from '@/services/user.service';
import { cookiesOpt } from '@/utils/cookiesOpt';

class UserController {
  register: Controller = async (req, res, next) => {
    try {
      await userService.register(req);
      res
        .status(201)
        .send(messageResponse('Congratulations! Your Account has been successfully created.', 'Please check your email inbox for further access.'));
    } catch (error) {
      next(error);
    }
  };

  verification: Controller = async (req, res, next) => {
    try {
      await userService.verification(req);
      res.status(200).send(messageResponse('Successfully verified your account', 'Please login for further access'));
    } catch (error) {
      next(error);
    }
  };

  login: Controller = async (req, res, next) => {
    try {
      const { accessToken, refreshToken } = await userService.login(req);
      res
        .status(201)
        .cookie('access_token', accessToken, cookiesOpt)
        .cookie('refresh_token', refreshToken, cookiesOpt)
        .send(messageResponse('Successfully login', "let's explore our product"));
    } catch (error) {
      next(error);
    }
  };

  authorization: Controller = async (req, res, next) => {
    try {
      const { accessToken } = await userService.authorization(req);
      res.send({ accessToken });
    } catch (error) {
      next(error);
    }
  };

  update: Controller = async (req, res, next) => {
    try {
      const { accessToken } = await userService.update(req);
      res.cookie('access_token', accessToken, cookiesOpt).send(messageResponse('Successfully edit your profile'));
    } catch (error) {
      next(error);
    }
  };

  updatePassword: Controller = async (req, res, next) => {
    try {
      const { accessToken } = await userService.updatePassword(req);
      res.cookie('access_token', accessToken, cookiesOpt).send(messageResponse('Successfully change your password'));
    } catch (error) {
      next(error);
    }
  };

  forgetPassword: Controller = async (req, res, next) => {
    try {
      await userService.forgetPassword(req);
      res.send(messageResponse('Successfully change your password', 'Try to login now'));
    } catch (error) {
      next(error);
    }
  };

  forgetPasswordVerification: Controller = async (req, res, next) => {
    try {
      await userService.forgetPasswordVerification(req);
      res.send(messageResponse('Check your email for reset your password'));
    } catch (error) {
      next(error);
    }
  };
}

export default new UserController();
