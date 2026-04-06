import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import path from 'path'
import { env } from './src/config/env.js'
import { connectDatabase } from './src/config/db.js'
import { seedAdminUser } from './src/seed/seedAdminUser.js'
import newsRouter from './src/routes/newsRoutes.js'
import publicationRouter from './src/routes/publicationRoutes.js'
import statsRouter from './src/routes/statsRoutes.js'
import subscriberRouter from './src/routes/subscriberRoutes.js'
import catalogRouter from './src/routes/catalogRoutes.js'
import authRouter from './src/routes/authRoutes.js'
import workflowRouter from './src/routes/workflowRoutes.js'
import adminRouter from './src/routes/adminRoutes.js'


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
  app.use('/uploads', express.static(path.resolve('uploads')))

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
  app.use('/api/v1', catalogRouter)
  app.use('/api/v1', authRouter)
  app.use('/api/v1', workflowRouter)
  app.use('/api/v1', adminRouter)

  app.use((req, res) => {
    res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` })
  })

  app.use((error, _req, res, _next) => {
    if (error?.name === 'MulterError') {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File is too large. Max allowed size is 25MB.' })
      }
      return res.status(400).json({ message: error.message || 'File upload failed' })
    }
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ message: 'Invalid resource id format' })
    }
    console.error(error)
    return res.status(500).json({ message: 'Internal server error' })
  })

  return app
}

const startServer = async () => {
  const isConnected = await connectDatabase()
  if (isConnected) {
    await seedAdminUser()
  }
  const app = createApp()

  app.listen(env.PORT, () => {
    console.log(`Backend API running on http://localhost:${env.PORT}`)
  })
}

startServer().catch((error) => {
  console.error('Failed to start backend:', error.message)
  process.exit(1)
})
