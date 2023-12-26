import {
  LoadFacebookUserApi,
  LoadUserAccountRepository,
  SaveFacebookAccountRepositry
} from '@/application/ports'
import { FacebookAccount } from '@/domain/entities'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'

export class FacebookAuthenticationService {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepo: LoadUserAccountRepository & SaveFacebookAccountRepositry
  ) {}

  async perform (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const fbData = await this.facebookApi.loadUser(params)
    if (fbData !== undefined) {
      const accountData = await this.userAccountRepo.load({ email: fbData.email })
      const fbAccount = new FacebookAccount(fbData, accountData)
      await this.userAccountRepo.saveWithFacebook(fbAccount)
    }
    return new AuthenticationError()
  }
}
