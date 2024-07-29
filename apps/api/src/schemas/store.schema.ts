import z from 'zod';

export const storeRegisterSchema = z
  .object({
    address: z.string().min(5, 'Address must be at least 5 characters long'),
    details: z.string().min(5, 'Details must be at least 5 characters long'),
    city_id: z.coerce.number().min(14, 'City must be required'),
    longitude: z.coerce.number({ message: 'Longitude muse be a float number' }),
    latitude: z.coerce.number({ message: 'Latitude muse be a float number' }),
    // name: z.string().min(5, 'Name must be at least 5 characters long'),
    // start_time: z.string().time(),
    // end_time: z.string().time(),
    selectedAdminId: z.string().array(),
  })
  // .refine((data) => data.end_time >= data.start_time, {
  //   message: 'Store end time must be greater or equal start time',
  //   path: ['end_time'],
  // });

export type StoreRegisterType = z.infer<typeof storeRegisterSchema>;
