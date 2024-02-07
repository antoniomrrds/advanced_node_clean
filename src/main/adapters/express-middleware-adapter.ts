/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Middleware } from '@/presentation/middlewares'
import { RequestHandler } from 'express'

type Adapter = (middleware: Middleware) => RequestHandler

export const adaptExpressMiddleware: Adapter = middleware => async (req, res, next) => {
  const { statusCode, body } = await middleware.handle({ ...req.headers })
  if (statusCode === 200) {
    const entries = Object.entries(body).filter(([, value]) => value)

    req.locals = { ...req.locals, ...Object.fromEntries(entries) }
    next()
  } else {
    res.status(statusCode).json({ error: body.message })
  }
}
