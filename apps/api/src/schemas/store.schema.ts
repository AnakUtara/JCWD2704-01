import z from 'zod';

type StoreRegisterType = z.infer<typeof storeRegisterSchema>;
const storeRegisterSchema = z.object({
  address: z.string().min(5, 'Address must be at least 5 characters long'),
  details: z.string().min(5, 'Details must be at least 5 characters long'),
  city_id: z.coerce.number().min(14, 'City must be required'),
  longitude: z.coerce.number({ message: 'Longitude muse be a float number' }),
  latitude: z.coerce.number({ message: 'Latitude muse be a float number' }),
  selectedAdminId: z.string().array().min(1),
});

type StoreUpdateType = z.infer<typeof storeUpadteSchema>;

const storeAdmin = z
  .object({
    id: z.string().optional(),
    address_id: z.string().optional(),
  })
  .array()
  .min(1)
  .optional();

const storeUpadteSchema = z.object({
  address_id: z.string().optional(),
  address: z.string().min(5, 'Address must be at least 5 characters long').optional(),
  details: z.string().min(5, 'Details must be at least 5 characters long').optional(),
  city_id: z.coerce.number().min(14, 'City must be required').optional(),
  longitude: z.coerce.number({ message: 'Longitude muse be a float number' }).optional(),
  latitude: z.coerce.number({ message: 'Latitude muse be a float number' }).optional(),
  storeAdmin,
});

export type { StoreRegisterType, StoreUpdateType };
export { storeRegisterSchema, storeUpadteSchema };
