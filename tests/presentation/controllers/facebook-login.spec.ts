import { AuthenticationError } from '@/domain/entities/errors'
import { Controller, FacebookLoginController } from '@/presentation/controllers'
import { UnauthorizedError } from '@/presentation/errors'
import { RequiredString } from '@/presentation/validation'

describe('FacebookLoginController', () => {
  let facebookAuth: jest.Mock
  let sut: FacebookLoginController
  let token: string

  beforeEach(() => {
    sut = new FacebookLoginController(facebookAuth)
  })
  beforeAll(() => {
    token = 'any_token'
    facebookAuth = jest.fn()
    facebookAuth.mockResolvedValue({ accessToken: 'any_value' })
  })
  it('Should extend Controller', async () => {
    expect(sut).toBeInstanceOf(Controller)
  })
  it('Should build validators correctly', async () => {
    const validators = sut.buildValidators({ token })

    expect(validators).toEqual([
      new RequiredString(token, 'token')
    ])
  })
  it('Should call FacebookAuthentication with correct params', async () => {
    await sut.handle({ token })

    expect(facebookAuth).toHaveBeenCalledWith({ token: 'any_token' })
    expect(facebookAuth).toHaveBeenCalledTimes(1)
  })
  it('Should return 401 if authentication fails', async () => {
    facebookAuth.mockRejectedValueOnce(new AuthenticationError())

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
