import { LoadFacebookUserApi } from '@/application/ports'
import { HttpGetClient } from '@/infrastructure/http'

export class FacebookApi {
  private readonly BASEURL = 'https://graph.facebook.com'
  constructor (private readonly httpClient: HttpGetClient) {}
  async loadUser (params: LoadFacebookUserApi.Params): Promise<void> {
    await this.httpClient.get({
      url: `${this.BASEURL}/oauth/access_token`
    })
  }
}
