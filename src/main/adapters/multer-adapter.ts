import { ServerError } from '@/presentation/errors'
import { RequestHandler } from 'express'
import multer from 'multer'

export const adaptMulter: RequestHandler = (req, res, next) => {
  const upload = multer().single('picture')
  upload(req, res, error => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    res.status(500).json({ error: new ServerError(error).message })
  })
}
