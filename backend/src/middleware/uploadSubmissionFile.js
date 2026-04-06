import fs from 'fs'
import path from 'path'
import multer from 'multer'

const uploadsRoot = path.resolve('uploads', 'submissions')

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    fs.mkdirSync(uploadsRoot, { recursive: true })
    cb(null, uploadsRoot)
  },
  filename: (_req, file, cb) => {
    const safeName = (file.originalname || 'file')
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .slice(-120)
    const timestamp = Date.now()
    cb(null, `${timestamp}-${safeName}`)
  },
})

export const uploadSubmissionFile = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
}).single('file')

