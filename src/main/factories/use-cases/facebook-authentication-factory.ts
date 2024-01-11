import { FacebookAuthenticationUseCase } from '@/domain/use-cases'
import {
  makeFacebookApi,
  makePgUserAccountRepo,
  makeJwtTokenGenerator
} from '@/main/factories'

export const makeFacebookAuthentication = (): FacebookAuthenticationUseCase => {
  return new FacebookAuthenticationUseCase(
    makeFacebookApi(),
    makePgUserAccountRepo(),
    makeJwtTokenGenerator()
  )
}
