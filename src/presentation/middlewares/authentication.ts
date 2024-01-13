import { forbidden } from '@/presentation/helpers'
import { HttpResponse } from '@/presentation/ports'

type HttpRequest = { authorization: string }

export class AuthenticationMiddleware {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse<Error>> {
    return forbidden()
  }
}
