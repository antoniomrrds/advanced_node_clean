import { AccessToken } from '@/domain/entities'
import { FacebookAuthentication } from '@/domain/features'
import { RequiredFieldError } from '@/presentation/errors'
import { HttpResponse } from '@/presentation/ports'
import { badRequest, ok, serverError, unauthorized } from '@/presentation/helpers'

type HttpRequest = { token: string }

type Model = Error | { accessToken: string }
export class FacebookLoginController {
  constructor (private readonly facebookAuth: FacebookAuthentication) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse<Model>> {
    try {
      const error = this.validate(httpRequest)
      if (error) {
        return badRequest(error)
      }

      const accessToken = await this.facebookAuth.perform({ token: httpRequest.token })
      if (accessToken instanceof AccessToken) {
        return ok({ accessToken: accessToken.value })
      } else {
        return unauthorized()
      }
    } catch (error) {
      return serverError(error)
    }
  }

  private validate (httpRequest: HttpRequest): Error | undefined {
    if ([undefined, null, ''].includes(httpRequest.token)) {
      return new RequiredFieldError('token')
    }
  }
}
