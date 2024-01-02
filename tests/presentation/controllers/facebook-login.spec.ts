import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { FacebookLoginController } from '@/presentation/controllers'
import { MockProxy, mock } from 'jest-mock-extended'

describe('FacebookLoginController', () => {
  let facebookAuth: MockProxy<FacebookAuthentication>
  let sut: FacebookLoginController

  beforeEach(() => {
    sut = new FacebookLoginController(facebookAuth)
  })
  beforeAll(() => {
    facebookAuth = mock()
  })
  it('Should return 400 if token is empty', async () => {
    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The field token is required')
    })
  })
  it('Should return 400 if token is null', async () => {
    const httpResponse = await sut.handle({ token: null })

    expect(httpResponse).toEqual({
      statusCode: 400,

      data: new Error('The field token is required')
    })
  })
  it('Should return 400 if token is undefined', async () => {
    const httpResponse = await sut.handle({ token: undefined })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The field token is required')
    })
  })
  it('Should call FacebookAuthentication with correct params', async () => {
    await sut.handle({ token: 'any_token' })

    expect(facebookAuth.perform).toHaveBeenCalledWith({ token: 'any_token' })
    expect(facebookAuth.perform).toHaveBeenCalledTimes(1)
  })
  it('Should return 401 if authentication fails', async () => {
    facebookAuth.perform.mockResolvedValueOnce(new AuthenticationError())
    const httpResponse = await sut.handle({ token: 'any_token' })

    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new AuthenticationError()
    })
  })
})