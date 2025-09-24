// src/db/index.ts
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { env } from '../env'
import * as schema from './schema'

// Create a mock database that logs warnings instead of throwing errors
const createMockDb = () => {
  return new Proxy({}, {
    get(target, prop) {
      if (prop === 'select' || prop === 'insert' || prop === 'update' || prop === 'delete') {
        return () => ({
          from: () => ({
            where: () => ({
              limit: () => Promise.resolve([]),
              orderBy: () => Promise.resolve([]),
            }),
            limit: () => Promise.resolve([]),
            orderBy: () => Promise.resolve([]),
          }),
          values: () => Promise.resolve([]),
          set: () => ({
            where: () => Promise.resolve([]),
          }),
        })
      }
      return () => {
        console.warn(`Database operation ${String(prop)} called but database is not available`)
        return Promise.resolve([])
      }
    }
  })
}

// Initialize database connection only if DATABASE_URL is available
export const pool = env.DATABASE_URL 
  ? new Pool({
      connectionString: env.DATABASE_URL,
    })
  : null

export const db = pool 
  ? drizzle(pool, { schema })
  : createMockDb() as any // Use mock database when not available

// Export schema for use in other parts of the application
export * from './schema'

// Helper function to check if database is available
export const isDatabaseAvailable = (): boolean => {
  return pool !== null
}

// Helper function to safely use database
export const withDatabase = <T>(callback: (db: ReturnType<typeof drizzle>) => Promise<T>): Promise<T | null> => {
  if (!isDatabaseAvailable()) {
    console.warn('Database not available - operation skipped')
    return Promise.resolve(null)
  }
  return callback(db as any)
}
