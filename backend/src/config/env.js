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
}
