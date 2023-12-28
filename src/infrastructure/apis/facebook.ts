import { LoadFacebookUserApi } from '@/application/ports'
import { HttpGetClient } from '@/infrastructure/http'

export class FacebookApi {
  private readonly BASEURL = 'https://graph.facebook.com'
  constructor (
    private readonly httpClient: HttpGetClient,
    private readonly clientId: string,
    private readonly clientSecret: string
  ) {}

  async loadUser (params: LoadFacebookUserApi.Params): Promise<void> {
    const appToken = await this.httpClient.get({
      url: `${this.BASEURL}/oauth/access_token`,
      params: {
        clientId: this.clientId,
        clientSecret: this.clientSecret,
        grant_type: 'client_credentials'
      }
    })

    await this.httpClient.get({
      url: `${this.BASEURL}/debug_token`,
      params: {
        access_token: appToken.access_token,
        input_token: params.token
      }
    })
  }
}
