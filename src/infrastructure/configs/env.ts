import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_URL_API: z.string().default('/api/v1'),
});
// Note: We use /api/v1 as a relative path which is proxied by Next.js rewrites to the actual backend.

const _env = envSchema.safeParse({
  NEXT_PUBLIC_URL_API: process.env.NEXT_PUBLIC_URL_API,
});

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format());
  throw new Error('Invalid environment variables');
}

export const env = _env.data;
export const URL_API = env.NEXT_PUBLIC_URL_API;
