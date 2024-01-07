import { FacebookApi } from '@/infrastructure/apis'
import { facebookApi } from '@/main/config/env'
import { makeAxiosHttpClient } from '@/main/factories'

export const makeFacebookApi = (): FacebookApi => {
  return new FacebookApi(makeAxiosHttpClient(), facebookApi.clientId, facebookApi.clientSecret)
}
