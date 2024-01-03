import { AccessToken } from '@/domain/entities'
import { FacebookAuthentication } from '@/domain/features'
import { HttpResponse } from '@/presentation/ports'
import { badRequest, ok, serverError, unauthorized } from '@/presentation/helpers'
import { ValidationComposite, ValidationBuilder } from '@/presentation/validation'

type HttpRequest = { token: string }

type Model = Error | { accessToken: string }
export class FacebookLoginController {
  constructor (private readonly facebookAuth: FacebookAuthentication) { }
  async handle (httpRequest: HttpRequest): Promise<HttpResponse<Model>> {
    try {
      const error = this.validate(httpRequest)
      return (error)
        ? badRequest(error)
        : await this.performFacebookAuth(httpRequest)
    } catch (error) {
      return serverError(error)
    }
  }

  private validate (httpRequest: HttpRequest): Error | undefined {
    return new ValidationComposite([
      ...ValidationBuilder.of({ value: httpRequest.token, fieldName: 'token' }).required().build()
    ]).validate()
  }

  private async performFacebookAuth ({ token }: HttpRequest): Promise<HttpResponse<Model>> {
    const accessToken = await this.facebookAuth.perform({ token })
    return (accessToken instanceof AccessToken)
      ? ok({ accessToken: accessToken.value })
      : unauthorized()
  }
}
