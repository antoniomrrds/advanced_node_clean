import { Authorize } from '@/domain/use-cases'
import { forbidden } from '@/presentation/helpers'
import { HttpResponse } from '@/presentation/ports'
import { RequiredStringValidator } from '@/presentation/validation'

type HttpRequest = { authorization: string }

export class AuthenticationMiddleware {
  constructor (private readonly authorize: Authorize) {}

  async handle ({ authorization }: HttpRequest): Promise<HttpResponse<Error> | undefined> {
    try {
      const errror = new RequiredStringValidator(authorization, 'authorization').validate()
      if (errror !== undefined) return forbidden()
      await this.authorize({ token: authorization })
    } catch {
      return forbidden()
    }
  }
}
