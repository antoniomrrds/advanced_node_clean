import { setupFacebookAuthentication, FacebookAuthentication } from '@/domain/use-cases'
import {
  makeFacebookApi,
  makePgUserAccountRepo,
  makeJwtTokenHandler
} from '@/main/factories'

export const makeFacebookAuthentication = (): FacebookAuthentication => {
  return setupFacebookAuthentication(
    makeFacebookApi(),
    makePgUserAccountRepo(),
    makeJwtTokenHandler())
}
