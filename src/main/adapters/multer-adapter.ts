import { ServerError } from '@/presentation/errors'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import multer from 'multer'

const handleUploadError = (res: Response, error: Error): Response => {
  return res.status(500).json({ error: new ServerError(error).message })
}

const attachFileToLocals = (req: Request): void => {
  req.file && (req.locals = { ...req.locals, file: { buffer: req.file.buffer, mimeType: req.file.mimetype } })
}

export const adaptMulter: RequestHandler = (req, res, next: NextFunction) => {
  const upload = multer().single('picture')

  upload(req, res, error => {
    if (error instanceof Error) handleUploadError(res, error)
    attachFileToLocals(req)
    next()
  })
}
