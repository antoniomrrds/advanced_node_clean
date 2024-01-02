import { AccessToken } from '@/domain/entities'
import { FacebookAuthentication } from '@/domain/features'
import { RequiredFieldError } from '@/presentation/errors'
import { HttpResponse } from '@/presentation/ports'
import { badRequest, ok, serverError, unauthorized } from '@/presentation/helpers'

export class FacebookLoginController {
  constructor (private readonly facebookAuth: FacebookAuthentication) {}
  async handle (httpRequest: any): Promise<HttpResponse> {
    try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      if (['', null, undefined].includes(httpRequest.token)) {
        return badRequest(new RequiredFieldError('token'))
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
}
