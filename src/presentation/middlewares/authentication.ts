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
      if (!this.validate({ authorization })) return forbidden()
      const userId = await this.authorize({ token: authorization })
      return ok({ userId })
    } catch {
      return forbidden()
    }
  }

  private validate ({ authorization }: HttpRequest): boolean {
    const errror = new RequiredStringValidator(authorization, 'authorization').validate()
    return errror === undefined
  }
}
