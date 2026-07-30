import { z } from "zod";

export const RegisterSchema = z.object({
  email: z.string().email("Invalid email address format."),
  password: z
    .string()
    .min(10, "Password must be at least 10 characters long.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
    .regex(/[0-9]/, "Password must contain at least one number.")
    .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, "Password must contain at least one special character."),
  name: z.string().min(2, "Name must be at least 2 characters long.").max(100),
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address format."),
  password: z.string().min(1, "Password is required."),
  mfaCode: z.string().length(6, "MFA code must be exactly 6 digits.").optional(),
});

export const MfaVerifySchema = z.object({
  token: z.string().length(6, "MFA code must be 6 digits."),
  secret: z.string().min(1, "MFA secret is required."),
});

export const UpdateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
}).strict(); // strict prevents mass assignment of arbitrary fields like role

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required."),
  newPassword: z
    .string()
    .min(10, "New password must be at least 10 characters long.")
    .regex(/[A-Z]/, "New password must contain at least one uppercase letter.")
    .regex(/[a-z]/, "New password must contain at least one lowercase letter.")
    .regex(/[0-9]/, "New password must contain at least one number.")
    .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, "New password must contain at least one special character."),
});

export const TransactionSchema = z.object({
  amount: z.number().positive("Amount must be positive."),
  currency: z.string().default("USD"),
  idempotencyKey: z.string().min(8, "Idempotency key required."),
  description: z.string().max(255).optional(),
}).strict();
