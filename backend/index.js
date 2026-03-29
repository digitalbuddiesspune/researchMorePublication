import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import { env } from './src/config/env.js'
import { connectDatabase } from './src/config/db.js'
import newsRouter from './src/routes/newsRoutes.js'
import publicationRouter from './src/routes/publicationRoutes.js'
import statsRouter from './src/routes/statsRoutes.js'
import subscriberRouter from './src/routes/subscriberRoutes.js'


const createApp = () => {
  const app = express()

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || env.CORS_ORIGIN.includes(origin)) {
          return callback(null, true)
        }
        return callback(new Error(`CORS blocked for origin: ${origin}`))
      },
      credentials: true,
    })
  )
  app.use(express.json())

  app.get('/', (_req, res) => {
    res.json({
      message: 'researchMorePublication backend is running',
      version: '1.0.0',
    })
  })

  app.use('/api/v1', newsRouter)
  app.use('/api/v1', publicationRouter)
  app.use('/api/v1', statsRouter)
  app.use('/api/v1', subscriberRouter)

  app.use((req, res) => {
    res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` })
  })

  app.use((error, _req, res, _next) => {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ message: 'Invalid resource id format' })
    }
    console.error(error)
    return res.status(500).json({ message: 'Internal server error' })
  })

  return app
}

const startServer = async () => {
  await connectDatabase()
  const app = createApp()

  app.listen(env.PORT, () => {
    console.log(`Backend API running on http://localhost:${env.PORT}`)
  })
}

startServer().catch((error) => {
  console.error('Failed to start backend:', error.message)
  process.exit(1)
})
