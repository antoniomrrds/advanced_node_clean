import { FacebookApi } from '@/infrastructure/apis'
import { HttpGetClient } from '@/infrastructure/http'
import { MockProxy, mock } from 'jest-mock-extended'

describe('Facebook API', () => {
  let clientId: string
  let clientSecret: string
  let sut: FacebookApi
  let httpClient: MockProxy<HttpGetClient>

  beforeAll(() => {
    clientId = 'any_client_id'
    clientSecret = 'any_client_secret'
    httpClient = mock()
  })

  beforeEach(() => {
    sut = new FacebookApi(httpClient, clientId, clientSecret)
  })
  it('Should get app token', async () => {
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
