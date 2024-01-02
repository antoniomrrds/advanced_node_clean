import { AccessToken } from '@/domain/entities'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { FacebookLoginController } from '@/presentation/controllers'
import { ServerError, UnauthorizedError } from '@/presentation/errors'
import { RequiredStringValidator } from '@/presentation/validation'
import { mocked } from 'jest-mock'
import { MockProxy, mock } from 'jest-mock-extended'

jest.mock('@/presentation/validation/required-string')

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
  it('Should return 400 if validation fails', async () => {
    const error = new Error('validation_error')
    const RequiredStringValidatorSpy = jest.fn().mockImplementationOnce(() => ({
      validate: jest.fn().mockReturnValueOnce(error)
    }))

    mocked(RequiredStringValidator).mockImplementationOnce(RequiredStringValidatorSpy)

    const httpResponse = await sut.handle({ token })

    expect(RequiredStringValidatorSpy).toHaveBeenCalledWith('any_token', 'token')
    expect(httpResponse).toEqual({
      statusCode: 400,
      body: error
    })
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
  it('Should return 500 if authentication throws', async () => {
    const error = new Error('infra_error')
    facebookAuth.perform.mockRejectedValueOnce(error)

    const httpResponse = await sut.handle({ token })

    expect(httpResponse).toEqual({
      statusCode: 500,
      body: new ServerError(error)
    })
  })
})
