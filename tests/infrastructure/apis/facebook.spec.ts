import { FacebookApi } from '@/infrastructure/apis'
import { HttpGetClient } from '@/infrastructure/http'
import { mock } from 'jest-mock-extended'

describe('Facebook API', () => {
  const clientId = 'any_client_id'
  const clientSecret = 'any_client_secret'
  it('Should get app token', async () => {
    const httpClient = mock<HttpGetClient>()
    const sut = new FacebookApi(httpClient, clientId, clientSecret)

    await sut.loadUser({ token: 'any_client_token' })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/oauth/access_token',
      params: {
        clientId,
        clientSecret,
        grant_type: 'client_credentials'
      }
    })
  })
})
