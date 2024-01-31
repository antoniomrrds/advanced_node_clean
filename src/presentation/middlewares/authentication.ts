import { forbidden, ok } from '@/presentation/helpers'
import { Middleware } from '@/presentation/middlewares'
import { HttpResponse } from '@/presentation/ports'
import { RequiredString } from '@/presentation/validation'

type HttpRequest = { authorization: string }
type Model = Error | { userId: string }

type Authorize = (params: { token: string }) => Promise<string>
export class AuthenticationMiddleware implements Middleware {
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
    const errror = new RequiredString(authorization, 'authorization').validate()
    return errror === undefined
  }
}
