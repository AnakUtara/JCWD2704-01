import { CitiesController } from '@/controllers/cities.controller';
import { Router } from 'express';

export class CitiesRouter {
  private router: Router;
  private citiesController: CitiesController;
  constructor() {
    this.citiesController = new CitiesController();
    this.router = Router();
    this.initializeRoutes();
  }
  private initializeRoutes(): void {
    this.router.get('/', this.citiesController.getAllCities);
    this.router.get('/city', this.citiesController.getCityByCityName);
  }
  getRouter(): Router {
    return this.router;
  }
}

export default new CitiesRouter();
