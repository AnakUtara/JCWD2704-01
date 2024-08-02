import citiesService from '@/services/cities.service';
import { NextFunction, Request, Response } from 'express';

export class CitiesController {
  async getAllCities(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await citiesService.getAllCities(req);
      res.send({ message: 'Fetch all cities data.', results });
    } catch (error) {
      next(error);
    }
  }
  async getCityByCityName(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await citiesService.getCityByCityName(req);
      res.send({ message: 'Fetch city data by city name.', results });
    } catch (error) {
      next(error);
    }
  }
}
