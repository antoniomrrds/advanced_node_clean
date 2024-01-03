import { AccessToken } from '@/domain/entities'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { FacebookLoginController } from '@/presentation/controllers'
import { UnauthorizedError } from '@/presentation/errors'
import { RequiredStringValidator } from '@/presentation/validation'
import { MockProxy, mock } from 'jest-mock-extended'

describe('FacebookLoginController', () => {
  let facebookAuth: MockProxy<FacebookAuthentication>
  let sut: FacebookLoginController
  let token: string

  beforeEach(() => {
    sut = new FacebookLoginController(facebookAuth)
  })
  beforeAll(() => {
    token = 'any_token'
    facebookAuth = mock()
    facebookAuth.perform.mockResolvedValue(new AccessToken('any_value'))
  })
  it('Should build validators correctly', async () => {
    const validators = sut.buildValidators({ token })

    expect(validators).toEqual([
      new RequiredStringValidator(token, 'token')
    ])
  })
  it('Should call FacebookAuthentication with correct params', async () => {
    await sut.handle({ token })

    expect(facebookAuth.perform).toHaveBeenCalledWith({ token: 'any_token' })
    expect(facebookAuth.perform).toHaveBeenCalledTimes(1)
  })
  it('Should return 401 if authentication fails', async () => {
    facebookAuth.perform.mockResolvedValueOnce(new AuthenticationError())
    const httpResponse = await sut.handle({ token })

    expect(httpResponse).toEqual({
      statusCode: 401,
      body: new UnauthorizedError()
    })
  })
  it('Should return 200 if authentication succeeds', async () => {
    const httpResponse = await sut.handle({ token })
    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {
        accessToken: 'any_value'
      }
    })
  })
})
