import prisma from '@/prisma';
import { catchAllErrors, InternalServerError } from '@/utils/error';
import { CityType, Prisma } from '@prisma/client';
import { Request } from 'express';

class CitiesService {
  async getAllCities(req: Request) {
    try {
      const cities = await prisma.city.findMany({
        where: { type: CityType.Kota },
        orderBy: { city_name: 'asc' },
        omit: { created_at: true, updated_at: true },
      });
      if (!cities) throw new InternalServerError('Unable to fetch cities.');
      return cities;
    } catch (error) {
      catchAllErrors(error);
    }
  }
  async getCityByCityName(req: Request) {
    try {
      const city = await prisma.city.findFirst({ where: { type: CityType.Kota, AND: { city_name: { contains: String(req.query.name) } } } });
      if (!city) throw new InternalServerError('Unable to fetch city.');
      return city;
    } catch (error) {
      catchAllErrors(error);
    }
  }
}

export default new CitiesService();
