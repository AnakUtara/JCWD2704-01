import express, { json, urlencoded, Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { corsOptions, PORT } from './config';
import cartRouter from './routers/cart.router';
import orderRouter from './routers/order.router';
import { CustomError } from './utils/error';
import { ZodError } from 'zod';
import cron from 'node-cron';
import orderService from './services/order.service';
import superAdminRouter from './routers/super-admin.router';
import citiesRouter from './routers/cities.router';
import categoryRouter from './routers/category.router';
import productRouter from './routers/product.router';
import storeRouter from './routers/store.router';
import userMiddleware from './middlewares/user.middleware';
import imageRouter from './routers/image.router';
import addressRouter from './routers/address.router';
import promotionRouter from './routers/promotion.router';
import { AxiosError } from 'axios';
import userRouter from './routers/user.router';
import { checkEligibleFreeShipping, checkVoucherExpiryScheduler } from './libs/cron/schedulers';
import { JsonWebTokenError } from 'jsonwebtoken';

export default class App {
  private app: Express;

  constructor() {
    this.app = express();
    this.configure();
    this.routes();
    this.handleError();
    this.autoSchedule();
    checkVoucherExpiryScheduler();
    checkEligibleFreeShipping();
  }

  private configure(): void {
    this.app.use(cors(corsOptions));
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
  }

  private handleError(): void {
    // not found
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      res.status(404).send('Not found !');
      next();
    });

    // error
    this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      console.error('Error : ', err.stack);
      if (err instanceof JsonWebTokenError) res.status(400).send(err.message);
      if (err instanceof ZodError) {
        const errorMessage = err.errors.map((err) => ({
          message: `${err.path.join('.')} is ${err.message}`,
        }));
      } else if (err instanceof CustomError) {
        res.status(err.statusCode).send({ message: err.message, causer: err.cause });
      } else if (err instanceof AxiosError) {
        res.status(err.status || 500).send(err.response?.data);
      } else {
        res.status(500).send({ message: err.message, causer: err.cause });
      }
    });
  }

  private routes(): void {
    this.app.get('/api', (req: Request, res: Response) => {
      res.send(`Hello, Purwadhika Student API!`);
    });
    this.app.use('/images', imageRouter.getRouter());
    this.app.use('/products', productRouter.getRouter());
    this.app.use('/categories', categoryRouter.getRouter());
    this.app.use('/users', userRouter.getRouter());
    this.app.use('/admin', superAdminRouter.getRouter());
    this.app.use('/cities', citiesRouter.getRouter());
    this.app.use('/store', storeRouter.getRouter());
    this.app.use('/addresses', addressRouter.getRouter());
    this.app.use('/cart', userMiddleware.accessToken, cartRouter.getRouter());
    this.app.use('/order', orderRouter.getRouter());
    this.app.use('/promotion', promotionRouter.getRouter());
  }

  public start(): void {
    this.app.listen(PORT, () => {
      orderService.orderAutoHandler();
      console.log(`  ➜  [API] Local:   http://localhost:${PORT}/`);
    });
  }

  public autoSchedule() {
    cron.schedule('* * * * *', orderService.orderAutoHandler);
  }
}
