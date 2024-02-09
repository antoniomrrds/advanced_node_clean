import { ServerError } from '@/presentation/errors'
import { RequestHandler } from 'express'
import multer from 'multer'

export const adaptMulter: RequestHandler = (req, res, next) => {
  const upload = multer().single('picture')
  upload(req, res, error => {
    if (error !== undefined) {
      return res.status(500).json({ error: new ServerError(error as Error).message })
    }
    if (req.file !== undefined) {
      req.locals = { ...req.locals, file: { buffer: req.file.buffer, mimeType: req.file.mimetype } }
    }
    next()
  })
}
