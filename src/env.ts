// src/env.ts
import { z } from 'zod'
import { config as loadEnv } from 'dotenv'

loadEnv() // load .env

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().positive().default(3000),

  DATABASE_URL: z.string().url(),

  AT_API_KEY: z.string(),
  AT_USERNAME: z.string(),

  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
})

export type Env = z.infer<typeof envSchema>

export const env: Env = (() => {
  try {
    return envSchema.parse(process.env)
  } catch (err) {
    console.error('❌ Invalid environment variables', err)
    process.exit(1)
  }
})()