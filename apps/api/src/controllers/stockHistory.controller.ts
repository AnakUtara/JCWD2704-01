import stockHistoryService from '@/services/stockHistory.service';
import { NextFunction, Request, Response } from 'express';

export class StockHistoryController {
  async getStockHistories(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await stockHistoryService.getStockHistories(req);
      res.send({ message: 'Fetched all stock history data.', results });
    } catch (error) {
      next(error);
    }
  }
}
