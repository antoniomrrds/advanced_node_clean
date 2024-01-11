import { HttpResponse } from '@/presentation/ports'
import { ok, unauthorized } from '@/presentation/helpers'
import { ValidationBuilder, Validator } from '@/presentation/validation'
import { Controller } from '@/presentation/controllers'
import { FacebookAuthentication } from '@/domain/use-cases'

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
    return this.facebookAuth({ token })
      .then((accessToken) => ok(accessToken))
      .catch(() => unauthorized())
  }
}
