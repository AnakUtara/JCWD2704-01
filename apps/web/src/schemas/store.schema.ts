import { z } from "zod";

export const stepOneSchema = z.object({
  address: z.string().min(5, "Address must be at least 5 characters long"),
  details: z.string().min(5, "Details must be at least 5 characters long"),
  city_id: z.coerce.number().min(14, "City must be required"),
  longitude: z.coerce.number({ message: "Longitude muse be a float number" }),
  latitude: z.coerce.number({ message: "Latitude muse be a float number" }),
});

const adminInfo = z.object({
  full_name: z.string().optional(),
  email: z.string().email().optional(),
  gender: z.string().optional(),
  address: z.string().optional(),
});

export const stepTwoSchema = z.object({
  selectedAdminId: z.string().array().min(1, { message: "Must select a store admin, at least 1 to choose." }),
  selectedAdminInfo: adminInfo.array(),
});

export const defaultResultDataSchema = z.object({
  address: z.string().optional(),
  details: z.string().optional(),
  city_id: z.number().optional(),
  longitude: z.coerce.number().optional(),
  latitude: z.coerce.number().optional(),
  selectedAdminId: z.string().array().optional(),
  selectedAdminInfo: adminInfo.array().optional(),
});

export const resultDataSchema = z.object({
  ...stepOneSchema.shape,
  ...stepTwoSchema.shape,
});

export const storeAdmin = z
  .object({
    id: z.string(),
    address_id: z.string().optional(),
  })
  .array()
  .min(1, { message: "Select at least one admin" });

export const storeUpadteSchema = z.object({
  address_id: z.string().optional(),
  address: z.string().min(5, "Address must be at least 5 characters long").optional(),
  details: z.string().min(5, "Details must be at least 5 characters long").optional(),
  city_id: z.coerce.number().min(14, "City must be required").optional(),
  longitude: z.coerce.number({ message: "Longitude muse be a float number" }).optional(),
  latitude: z.coerce.number({ message: "Latitude muse be a float number" }).optional(),
  storeAdmin,
});

export const storeUpadteLocSchema = z.object({
  address_id: z.string(),
  address: z.string().min(5, "Address must be at least 5 characters long"),
  details: z.string().min(5, "Details must be at least 5 characters long"),
  city_id: z.coerce.number({ message: "City must be required" }).min(14),
  longitude: z.coerce.number({ message: "Longitude muse be a float number" }),
  latitude: z.coerce.number({ message: "Latitude muse be a float number" }),
});

export type StoreUpdateSchemaType = z.infer<typeof storeUpadteSchema>;
export type ResultData = z.infer<typeof resultDataSchema>;
export type AdminInfo = z.infer<typeof adminInfo>;
export type DefaultResultDataType = z.infer<typeof defaultResultDataSchema>;
