import dotenv from 'dotenv'

dotenv.config()

const parseCorsOrigins = (value) =>
  (value || 'http://localhost:5173,http://localhost:5174')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT || 5000),
  MONGO_URI: process.env.MONGO_URI || '',
  CORS_ORIGIN: parseCorsOrigins(process.env.CORS_ORIGIN),
  JWT_SECRET: process.env.JWT_SECRET || 'change-me-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  ADMIN_SEED_NAME: process.env.ADMIN_SEED_NAME || '',
  ADMIN_SEED_EMAIL: process.env.ADMIN_SEED_EMAIL || '',
  ADMIN_SEED_PASSWORD: process.env.ADMIN_SEED_PASSWORD || '',
  STAFF_SEED_NAME: process.env.STAFF_SEED_NAME || '',
  STAFF_SEED_EMAIL: process.env.STAFF_SEED_EMAIL || '',
  STAFF_SEED_PASSWORD: process.env.STAFF_SEED_PASSWORD || '',
  STAFF_SEED_ROLE: process.env.STAFF_SEED_ROLE || 'editor',
}
