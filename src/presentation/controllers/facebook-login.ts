import { AccessToken } from '@/domain/entities'
import { FacebookAuthentication } from '@/domain/features'
import { ServerError } from '@/presentation/errors'
import { HttpResponse } from '@/presentation/ports'

export class FacebookLoginController {
  constructor (private readonly facebookAuth: FacebookAuthentication) {}
  async handle (httpRequest: any): Promise<HttpResponse> {
    try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      if (['', null, undefined].includes(httpRequest.token)) {
        return {
          statusCode: 400,
          data: new Error('The field token is required')
        }
      }
      const result = await this.facebookAuth.perform({ token: httpRequest.token })
      if (result instanceof AccessToken) {
        return {
          statusCode: 200,
          data: {
            accessToken: result.value
          }
        }
      } else {
        return {
          statusCode: 401,
          data: result
        }
      }
    } catch (error) {
      return {
        statusCode: 500,
        data: new ServerError(error instanceof Error ? error : undefined)
      }
    }
  }
}
