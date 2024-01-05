import { FacebookApi } from '@/infrastructure/apis'
import { AxiosHttpClient } from '@/infrastructure/http'
import { facebookApi, userFacebookApi } from '@/main/config/env'

describe('Facebook Api Integration Tests', () => {
  const tokenClient = userFacebookApi.token

  let axiosClient: AxiosHttpClient
  let sut: FacebookApi

  beforeEach(() => {
    axiosClient = new AxiosHttpClient()
    sut = new FacebookApi(axiosClient,
      facebookApi.clientId,
      facebookApi.clientSecret
    )
  })

  it('Should return a Facebook User if token is valid', async () => {
    const fbUser = await sut.loadUser({ token: tokenClient })

    expect(fbUser).toEqual({
      facebookId: userFacebookApi.facebookId,
      name: userFacebookApi.name,
      email: userFacebookApi.email
    })
  })
  it('Should return undefined if token is invalid', async () => {
    const fbUser = await sut.loadUser({ token: 'invalid_token' })

    expect(fbUser).toBeUndefined()
  })
})
