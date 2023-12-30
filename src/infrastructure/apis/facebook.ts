import { LoadFacebookUserApi } from '@/application/ports'
import { HttpGetClient } from '@/infrastructure/http'

export class FacebookApi implements LoadFacebookUserApi {
  private readonly BASEURL = 'https://graph.facebook.com'
  constructor (
    private readonly httpClient: HttpGetClient,
    private readonly clientId: string,
    private readonly clientSecret: string
  ) {}

  async loadUser (params: LoadFacebookUserApi.Params): Promise<LoadFacebookUserApi.Result> {
    const userInfo = await this.getUserInfo(params.token)
    return {
      facebookId: userInfo.id,
      name: userInfo.name,
      email: userInfo.email
    }
  }

  private async getAppToken (): Promise<{ access_token: string }> {
    return this.httpClient.get({
      url: `${this.BASEURL}/oauth/access_token`,
      params: {
        clientId: this.clientId,
        clientSecret: this.clientSecret,
        grant_type: 'client_credentials'
      }
    })
  }

  private async getDebugToken (clientToken: string): Promise<{ data: { user_id: string } }> {
    const { access_token: accessToken } = await this.getAppToken()
    return await this.httpClient.get({
      url: `${this.BASEURL}/debug_token`,
      params: {
        access_token: accessToken,
        input_token: clientToken
      }
    })
  }

  private async getUserInfo (clientToken: string): Promise<{ id: string, name: string, email: string }> {
    const { data: { user_id: userId } } = await this.getDebugToken(clientToken)
    return this.httpClient.get({
      url: `${this.BASEURL}/${userId}`,
      params: {
        fields: ['id', 'name', 'email'].join(','),
        access_token: clientToken
      }
    })
  }
}