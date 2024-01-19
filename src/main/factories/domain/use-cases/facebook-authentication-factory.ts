import { setupFacebookAuthentication, FacebookAuthentication } from '@/domain/use-cases'
import { makeFacebookApi, makeJwtTokenHandler, makePgUserAccountRepo } from '@/main/factories/infrastructure'

export const makeFacebookAuthentication = (): FacebookAuthentication => {
  return setupFacebookAuthentication(
    makeFacebookApi(),
    makePgUserAccountRepo(),
    makeJwtTokenHandler())
}
