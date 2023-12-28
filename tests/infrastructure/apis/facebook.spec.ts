import { FacebookApi } from '@/infrastructure/apis'
import { HttpGetClient } from '@/infrastructure/http'
import { mock } from 'jest-mock-extended'

describe('Facebook API', () => {
  it('Should get app token', async () => {
    const httpClient = mock<HttpGetClient>()
    const sut = new FacebookApi(httpClient)

    await sut.loadUser({ token: 'any_client_token' })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/oauth/access_token'
    })
  })
})
