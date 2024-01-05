import { FacebookApi } from '@/infrastructure/apis'
import { AxiosHttpClient } from '@/infrastructure/http'
import { facebookApi, userFacebookApi } from '@/main/config/env'

describe('Facebook Api Integration Tests', () => {
  const tokenClient = userFacebookApi.token

  it('Should return a Facebook User if token is valid', async () => {
    const axiosClient = new AxiosHttpClient()
    const sut = new FacebookApi(axiosClient,
      facebookApi.clientId,
      facebookApi.clientSecret
    )

    const fbUser = await sut.loadUser({ token: tokenClient })

    expect(fbUser).toEqual({
      facebookId: userFacebookApi.facebookId,
      name: userFacebookApi.name,
      email: userFacebookApi.email
    })
  })
})
