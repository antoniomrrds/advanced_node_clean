import { RequestHandler } from 'express'
import { Controller } from '@/presentation/controllers'
export const adaptExpressRoute = (controller: Controller): RequestHandler => {
  return (req, res, next) => {
    controller.handle({ ...req.body })
      .then(httpResponse => {
        if (httpResponse.statusCode === 200) {
          res.status(200).json(httpResponse.body)
        } else {
          res.status(httpResponse.statusCode).json({ error: httpResponse.body.message })
        }
      })
      .catch(err => next(err))
  }
}
