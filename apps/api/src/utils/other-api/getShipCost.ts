import { rajaOngkirCostParamSchema, rajaOngkirCostQuerySchema } from '@/libs/zod-schemas/order.schema';
import prisma from '@/prisma';
import { InternalServerError, NotFoundError } from '../error';
import { z } from 'zod';
import { TRajaOngkirCostResponse } from '@/models/rajaOngkirResponse.model';
import axios from 'axios';
import { RAJAONGKIR_API_KEY } from '@/config';

export async function getShipCost(query: z.infer<typeof rajaOngkirCostQuerySchema>) {
  const getCity = async (select: 'origin' | 'destination') =>
    (
      await prisma.address.findUnique({
        select: { city_id: true },
        where: { id: query[select] },
      })
    )?.city_id;
  const convert = async () => {
    const origin = await getCity('origin');
    if (!origin) throw new NotFoundError('not found store address id');
    const destination = await getCity('destination');
    if (!destination) throw new NotFoundError('not found destination address address id');
    return {
      ...query,
      origin,
      destination,
      weight: Number(query.weight),
    };
  };
  const fetchRajaOngkirCost = async (params: z.infer<typeof rajaOngkirCostParamSchema>) => {
    try {
      const rajaOngkirInstance = axios.create({
        baseURL: 'https://api.rajaongkir.com/starter',
        withCredentials: true,
        headers: { key: RAJAONGKIR_API_KEY },
      });
      const data = await rajaOngkirInstance.post<TRajaOngkirCostResponse>('/cost', { ...params });
      return data;
    } catch (error) {
      const a = error as any;
      throw new InternalServerError('RajaOngkir: ' + a.response.data.rajaongkir.status.description);
    }
  };
  return (await fetchRajaOngkirCost(await convert())).data;
}
