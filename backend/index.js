import { createApp } from './src/app.js'
import { connectDatabase } from './src/config/db.js'
import { env } from './src/config/env.js'

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