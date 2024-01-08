import { Request, Response } from 'express'
import { Controller } from '@/presentation/controllers'
export class ExpressRouterAdapter {
  constructor (private readonly controller: Controller) {}
  async adapt (req: Request, res: Response): Promise<void> {
    const httpResponse = await this.controller.handle({ ...req.body })
    if (httpResponse.statusCode === 200) {
      res.status(200).json(httpResponse.body)
    } else {
      res.status(400).json({ error: httpResponse.body.message })
    }
  }
}
