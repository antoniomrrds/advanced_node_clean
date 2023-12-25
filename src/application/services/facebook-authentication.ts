import { LoadFacebookUserApi } from '@/application/ports'
import { FacebookAuthentication } from '@/domain/features'

export class FacebookAuthenticationService {
  constructor (private readonly loadFacebookUserApi: LoadFacebookUserApi) {}
  async perform (params: FacebookAuthentication.Params): Promise<void> {
    await this.loadFacebookUserApi.loadUser(params)
  }
}
