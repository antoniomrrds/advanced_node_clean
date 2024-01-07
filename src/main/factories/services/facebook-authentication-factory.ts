import { FacebookAuthenticationService } from '@/application/services'
import {
  makeFacebookApi,
  makePgUserAccountRepo,
  makeJwtTokenGenerator
} from '@/main/factories'

export const makeFacebookAuthenticationService = (): FacebookAuthenticationService => {
  return new FacebookAuthenticationService(
    makeFacebookApi(),
    makePgUserAccountRepo(),
    makeJwtTokenGenerator()
  )
}
