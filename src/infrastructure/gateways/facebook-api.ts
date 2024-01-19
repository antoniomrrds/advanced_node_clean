import { LoadFacebookUser } from '@/domain/ports'
import { HttpGetClient } from '@/infrastructure/gateways'

type Input = LoadFacebookUser.Input
type Output = LoadFacebookUser.Output
export class FacebookApi implements LoadFacebookUser {
  private readonly BASEURL = 'https://graph.facebook.com'
  constructor (
    private readonly httpClient: HttpGetClient,
    private readonly clientId: string,
    private readonly clientSecret: string
  ) {}

  async loadUser ({ token }: Input): Promise<Output> {
    return this.getUserInfo(token)
      .then(({ id, name, email }) => ({ facebookId: id, name, email }))
      .catch(() => undefined)
  }

  private async getAppToken (): Promise<{ access_token: string }> {
    return this.httpClient.get({
      url: `${this.BASEURL}/oauth/access_token`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials'
      }
    })
  }

  private async getDebugToken (clientToken: string): Promise<{ data: { user_id: string } }> {
    const { access_token } = await this.getAppToken()
    return this.httpClient.get({
      url: `${this.BASEURL}/debug_token`,
      params: {
        access_token,
        input_token: clientToken
      }
    })
  }

  private async getUserInfo (clientToken: string): Promise<{ id: string, name: string, email: string }> {
    const { data: { user_id } } = await this.getDebugToken(clientToken)
    return this.httpClient.get({
      url: `${this.BASEURL}/${user_id}`,
      params: {
        fields: ['id', 'name', 'email'].join(','),
        access_token: clientToken
      }
    })
  }
}
