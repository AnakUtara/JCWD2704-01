import { z } from "zod";

const email = z.string().email();
const password = z.string().min(6, { message: "Password requires at least 6 characters" });
const full_name = z.string().min(4, { message: "Full Name requires at least 4 characters" });
const dob = z.date().optional();
const phone_no = z
  .string()
  .min(10, { message: "Phone Number requires min 10 numbers" })
  .max(12, { message: "Phone Number requires max 12 numbers" })
  .optional();
const avatar = z
  .instanceof(File || undefined)
  .refine((file) => file?.size < 1024 * 1024, { message: "File size must be less or equal than 1mb" })
  .refine((file) => file.type.startsWith("image/"), { message: "File type isn't image" })
  .refine((file) => file?.size < 1024 * 1024, { message: "File size must be less or equal than 1mb" })
  .refine((file) => file.type.startsWith("image/"), { message: "File type isn't image" })
  .optional();

export const registerSchema = z
  .object({
    avatar,
    email,
    password,
    confirmPassword: z.string(),
    full_name,
    gender: z.union([z.literal("male"), z.literal("female")], {
      message: "Gender requires at least pick one",
    }),
    phone_no,
    dob,
    referrence_code: z
      .string()
      .refine((value) => value.length === 9, { message: "Invalid Referral Code" })
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Confirm password must be equal to your password",
    path: ["confirmPassword"],
  });

export type RegisterType = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email,
  password,
});

export type LoginType = z.infer<typeof loginSchema>;

export const emailVerificationSchema = z.object({
  email,
});

export const forgetPasswordSchema = z
  .object({
    password,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Confirm password must be equal to your password",
    path: ["confirmPassword"],
  });

export type EmailVerificationType = z.infer<typeof emailVerificationSchema>;
export type ForgetPasswordType = z.infer<typeof forgetPasswordSchema>;

export const changePasswordSchema = z
  .object({
    password,
    newPassword: password,
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Confirm new password must be equal to your password",
    path: ["confirmNewPassword"],
  });

export type ChangePasswordType = z.infer<typeof changePasswordSchema>;

export const changeProfileSchema = z.object({
  avatar,
  full_name: full_name.optional(),
  phone_no,
  dob,
});

export type ChangeProfileType = z.infer<typeof changeProfileSchema>;
