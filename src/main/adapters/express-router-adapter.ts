/* eslint-disable @typescript-eslint/no-misused-promises */
import { RequestHandler } from 'express'
import { Controller } from '@/presentation/controllers'
type Adapter = (controller: Controller) => RequestHandler

export const adaptExpressRoute: Adapter = controller => async (req, res) => {
  const { statusCode, body } = await controller.handle({ ...req.body })
  const json = statusCode === 200 ? body : { error: body.message }
  res.status(statusCode).json(json)
}
