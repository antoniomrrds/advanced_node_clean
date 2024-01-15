import { Middleware } from '@/presentation/middlewares'
import { RequestHandler } from 'express'

type Adapter = (middleware: Middleware) => RequestHandler

export const adaptExpressMiddleware: Adapter = middleware => async (req, res, next) => {
  const { statusCode, body } = await middleware.handle({ ...req.headers })
  return res.status(statusCode).json(body)
}
