import { z } from "zod";

export const stepOneSchema = z.object({
  address: z.string().min(5, "Address must be at least 5 characters long"),
  details: z.string().min(5, "Details must be at least 5 characters long"),
  city_id: z.coerce.number().min(14, "City must be required"),
  longitude: z.coerce.number({ message: "Longitude muse be a float number" }),
  latitude: z.coerce.number({ message: "Latitude muse be a float number" }),
});
export const stepTwoSchema = z.object({
  name: z.string().min(5, "Name must be at least 5 characters long"),
  start_time: z.coerce.date({ message: "Start time must be required" }),
  end_time: z.coerce.date({ message: "End time must be required" }),
});

const adminInfo = z.object({
  full_name: z.string().optional(),
  email: z.string().email().optional(),
  gender: z.string().optional(),
  address: z.string().optional(),
});

export const stepThreeSchema = z.object({
  selectedAdminId: z.string().array().min(1, { message: "Must select a store admin, at least 1 to choose." }),
  selectedAdminInfo: adminInfo.array(),
});

export const defaultResultDataSchema = z.object({
  address: z.string().optional(),
  details: z.string().optional(),
  city_id: z.number().optional(),
  longitude: z.coerce.number().optional(),
  latitude: z.coerce.number().optional(),
  name: z.string().optional(),
  start_time: z.string().time().optional(),
  end_time: z.string().time().optional(),
  selectedAdminId: z.string().array().optional(),
  selectedAdminInfo: adminInfo.array().optional(),
});

export const resultDataSchema = z.object({
  ...stepOneSchema.shape,
  ...stepTwoSchema.shape,
  ...stepThreeSchema.shape,
});

export type ResultData = z.infer<typeof resultDataSchema>;
export type AdminInfo = z.infer<typeof adminInfo>;
export type DefaultResultDataType = z.infer<typeof defaultResultDataSchema>;
