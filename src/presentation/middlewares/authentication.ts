import { Authorize } from '@/domain/use-cases'
import { forbidden, ok } from '@/presentation/helpers'
import { HttpResponse } from '@/presentation/ports'
import { RequiredStringValidator } from '@/presentation/validation'

type HttpRequest = { authorization: string }
type Model = Error | { userId: string }

export class AuthenticationMiddleware {
  constructor (private readonly authorize: Authorize) {}

  async handle ({ authorization }: HttpRequest): Promise<HttpResponse<Model>> {
    try {
      const errror = new RequiredStringValidator(authorization, 'authorization').validate()
      if (errror !== undefined) return forbidden()
      const userId = await this.authorize({ token: authorization })
      return ok({ userId })
    } catch {
      return forbidden()
    }
  }
}
