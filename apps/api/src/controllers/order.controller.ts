import orderService from '@/services/order.service';
import { EntityController } from './entity.controller';
import order2Service from '@/services/order2.service';
import orderMidtransService from '@/services/orderMidtrans.service';
import { NextFunction, Request, Response } from 'express';
import reportService from '@/services/report.service';

export class OrderController extends EntityController {
  createCutomerOrder = this.sendResponse({
    service: order2Service.createOrder,
    response: ({ res, data }) => {
      res.send({ message: 'Success create order', data });
    },
    status: 201,
  });

  getOrderList = this.sendResponse({
    service: orderService.getOrderList,
    response: 'fetch order list',
  });

  getShipCost = this.sendResponse({
    service: order2Service.getShipCost,
    response: 'fetch shipping cost',
  });

  getOrderByInv = this.sendResponse({
    service: orderService.getOrderByInv,
    response: 'fetch order',
  });

  uploadPaymentProof = this.sendResponse({
    service: orderService.uploadPaymentProof,
    status: 201,
    response: ({ res, data }) => {
      res.send({ message: 'Success upload payment', data });
    },
  });

  approveOrderPayment = this.sendResponse({
    service: orderService.approveOrderPayment,
    status: 201,
    response: 'success approve order',
  });

  sendingOrder = this.sendResponse({
    service: orderService.sendingOrder,
    status: 201,
    response: 'sending order',
  });

  cancelOrder = this.sendResponse({
    service: orderService.cancelOrder,
    status: 201,
    response: 'Success canceling order',
  });

  orderDelivered = this.sendResponse({
    service: orderService.orderDelivered,
    status: 201,
    response: 'Success, order delivered',
  });

  payViaMidtrans = this.sendResponse({
    service: orderMidtransService.payViaMidtrans,
    response: 'fetch payment link',
  });

  async getSalesReport(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await reportService.getSalesReport(req);
      res.send({ message: 'Fetched monthly sales report.', results });
    } catch (error) {
      next(error);
    }
  }
}
export default new OrderController();
