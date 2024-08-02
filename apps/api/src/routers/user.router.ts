import { Router } from 'express';

import { blobUploader } from '@/libs/multer';
import userController from '@/controllers/user.controller';
import userMiddleware from '@/middlewares/user.middleware';

class UserRouter {
  private router: Router;

  constructor() {
    this.router = Router();
    this.initializedRoutes();
  }

  private initializedRoutes() {
    // [X] Feature Register
    this.router.get('/v1/:token', userController.verification); // Register Email verification
    this.router.post('/v1', blobUploader().single('avatar'), userController.register); // Register

    // [X] Feature Update
    this.router.patch('/v1/profile', userMiddleware.accessToken, blobUploader().single('avatar'), userController.update); // Update Profile
    this.router.patch('/v1/password', userMiddleware.accessToken, userController.updatePassword); // Update Password

    // [X] Feature Login and Authoriztion User
    this.router.get('/v2', userMiddleware.refreshToken, userController.authorization); // Refresh and Access token
    this.router.post('/v2', userController.login); // Login

    // [X] Feature Forget Password User
    this.router.patch('/v3/:token', userController.forgetPassword); // Forget password
    this.router.post('/v3', userController.forgetPasswordVerification); // Forget Password Email verification
  }

  public getRouter() {
    return this.router;
  }
}

export default new UserRouter();
