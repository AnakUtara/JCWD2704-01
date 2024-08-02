import { StockHistoryController } from '@/controllers/stockHistory.controller';
import storeController from '@/controllers/store.controller';
import storeManagementController from '@/controllers/storeManagement.controller';
import { StoreStockController } from '@/controllers/storeStock.controller';
import { getNearestStoreSchema } from '@/libs/zod-schemas/store.schema';
import { authorizeStoreAdmin, verifyAdminAccToken } from '@/middlewares/admin.middleware';
import { checkIsStockAssigned, checkIsStockExist, validateInitStock, validateUpdateStock } from '@/middlewares/store.middleware';
import userMiddleware from '@/middlewares/user.middleware';
import { Router } from 'express';

export class StoreRouter {
  private router: Router;
  storeStockController: StoreStockController;
  stockHistoryController: StockHistoryController;
  constructor() {
    this.router = Router();
    this.storeStockController = new StoreStockController();
    this.stockHistoryController = new StockHistoryController();
    this.initializeRoutes();
  }
  private initializeRoutes(): void {
    this.router.get('/nearest', storeController.getNearestStore);
    this.router.get('/list', userMiddleware.accessToken, storeController.getStoreList);
    this.router.get('/products', this.storeStockController.getProductByStoreId);
    this.router.get('/products/recommendations', this.storeStockController.getProductRecommendationsByCityId);
    this.router.get('/products/:name', this.storeStockController.getProductDetailsByStoreId);
    this.router.get('/names-ids', storeController.getStoreNamesIds);
    this.router.get('/stocks', this.storeStockController.getStoreStocks);
    this.router.get('/stocks/find', this.storeStockController.getProductsByQuery);
    this.router.get('/stocks/histories', this.stockHistoryController.getStockHistories);
    this.router.get('/stocks/report', userMiddleware.accessToken, authorizeStoreAdmin, this.stockHistoryController.getStockHistoryReport);
    this.router.post(
      '/stocks',
      verifyAdminAccToken,
      authorizeStoreAdmin,
      checkIsStockAssigned,
      validateInitStock,
      this.storeStockController.initStock,
    );
    this.router.patch(
      '/stocks/:id',
      verifyAdminAccToken,
      authorizeStoreAdmin,
      checkIsStockExist,
      validateUpdateStock,
      this.storeStockController.updateStock,
    );
    this.router.get('/v1', userMiddleware.accessToken, storeManagementController.get);
    this.router.post('/v1', userMiddleware.accessToken, storeManagementController.create);
    this.router.patch('/v1', userMiddleware.accessToken, storeManagementController.update);
    this.router.get('/:city_id', storeController.getStoreByCityId);
    this.router.get('/v1/:id', userMiddleware.accessToken, storeManagementController.getById);
    this.router.delete('/v1/:id', userMiddleware.accessToken, storeManagementController.delete);
  }
  getRouter(): Router {
    return this.router;
  }
}

export default new StoreRouter();
