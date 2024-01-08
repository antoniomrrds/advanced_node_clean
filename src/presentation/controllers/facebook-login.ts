import { AccessToken } from '@/domain/entities'
import { FacebookAuthentication } from '@/domain/features'
import { HttpResponse } from '@/presentation/ports'
import { ok, unauthorized } from '@/presentation/helpers'
import { ValidationBuilder, Validator } from '@/presentation/validation'
import { Controller } from '@/presentation/controllers'

type HttpRequest = { token: string }

type Model = Error | { accessToken: string }
export class FacebookLoginController extends Controller {
  constructor (private readonly facebookAuth: FacebookAuthentication) {
    super()
  }

  async perform (httpRequest: HttpRequest): Promise<HttpResponse<Model>> {
    return await this.performFacebookAuth(httpRequest)
  }

  override buildValidators ({ token }: HttpRequest): Validator[] {
    return [...ValidationBuilder.of({ value: token, fieldName: 'token' }).required().build()]
  }

  private async performFacebookAuth ({ token }: HttpRequest): Promise<HttpResponse<Model>> {
    const accessToken = await this.facebookAuth.perform({ token })
    return (accessToken instanceof AccessToken)
      ? ok({ accessToken: accessToken.value })
      : unauthorized()
  }
}
