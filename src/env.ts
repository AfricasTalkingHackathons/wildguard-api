// src/env.ts
import { z } from 'zod'
import { config as loadEnv } from 'dotenv'

loadEnv() // load .env

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().positive().default(3000),

  // Make database URL optional for initial deployment
  DATABASE_URL: z.string().url().optional(),

  // Make Africa's Talking credentials optional for initial deployment
  AT_API_KEY: z.string().optional(),
  AT_USERNAME: z.string().optional(),

  // Make JWT secret optional with default for initial deployment
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters').default('wildguard-default-jwt-secret-key-for-development-only-change-in-production'),
})

export type Env = z.infer<typeof envSchema>

export const env: Env = (() => {
  try {
    const parsed = envSchema.parse(process.env)
    
    // Log warnings for missing critical environment variables in production
    if (parsed.NODE_ENV === 'production') {
      if (!parsed.DATABASE_URL) {
        console.warn('⚠️  DATABASE_URL not set in production - database features will be disabled')
      }
      if (!parsed.AT_API_KEY || !parsed.AT_USERNAME) {
        console.warn('⚠️  Africa\'s Talking credentials not set - SMS/USSD/Voice features will be disabled')
      }
      if (parsed.JWT_SECRET === 'wildguard-default-jwt-secret-key-for-development-only-change-in-production') {
        console.warn('⚠️  Using default JWT secret - please set JWT_SECRET environment variable')
      }
    }
    
    return parsed
  } catch (err) {
    console.error('❌ Invalid environment variables', err)
    
    // In production, provide more helpful error message
    if (process.env.NODE_ENV === 'production') {
      console.error('Please ensure the following environment variables are set:')
      console.error('- PORT (optional, defaults to 3000)')
      console.error('- DATABASE_URL (optional for basic functionality)')
      console.error('- AT_API_KEY and AT_USERNAME (optional for Africa\'s Talking features)')
      console.error('- JWT_SECRET (optional, will use default if not set)')
    }
    
    process.exit(1)
  }
})()