import { FacebookAuthentication } from '@/domain/features'
import { HttpResponse } from '@/presentation/ports'

export class FacebookLoginController {
  constructor (private readonly facebookAuth: FacebookAuthentication) {}
  async handle (httpRequest: any): Promise<HttpResponse> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    if (['', null, undefined].includes(httpRequest.token)) {
      return {
        statusCode: 400,
        data: new Error('The field token is required')
      }
    }
    const result = await this.facebookAuth.perform({ token: httpRequest.token })
    return {
      statusCode: 401,
      data: result
    }
  }
}
