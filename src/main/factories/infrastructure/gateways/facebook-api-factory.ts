import { FacebookApi } from '@/infrastructure/gateways'
import { facebookApi } from '@/main/config/env'
import { makeAxiosHttpClient } from '@/main/factories/infrastructure/gateways'

export const makeFacebookApi = (): FacebookApi => {
  return new FacebookApi(
    makeAxiosHttpClient(),
    facebookApi.clientId,
    facebookApi.clientSecret)
}
