import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const registerSchema = z.object({
  username: z.string().min(1),
  email: z.string().email(),
  role: z.string().min(1),
  otp: z.string().min(1),
  password: z.string().optional(),
});
