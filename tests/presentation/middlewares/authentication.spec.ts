import { ForbiddenError } from '@/presentation/errors'
import { AuthenticationMiddleware } from '@/presentation/middlewares'

describe('AuthenticationMiddleware', () => {
  let sut: AuthenticationMiddleware
  let authorization: string
  let authorize: jest.Mock

  beforeEach(() => {
    sut = new AuthenticationMiddleware(authorize)
  })

  beforeAll(() => {
    authorization = 'any_authorization_token'
    authorize = jest.fn()
  })

  it('Should return 403 if authorization is empty', async () => {
    const httpResponse = await sut.handle({ authorization: '' })

    expect(httpResponse).toEqual({
      statusCode: 403,
      body: new ForbiddenError()
    })
  })
  it('Should return 403 if authorization is null', async () => {
    const httpResponse = await sut.handle({ authorization: null as any })

    expect(httpResponse).toEqual({
      statusCode: 403,
      body: new ForbiddenError()
    })
  })
  it('Should return 403 if authorization is undefined', async () => {
    const httpResponse = await sut.handle({ authorization: undefined as any })

    expect(httpResponse).toEqual({
      statusCode: 403,
      body: new ForbiddenError()
    })
  })
  it('Should call authorization with correct params', async () => {
    await sut.handle({ authorization })

    expect(authorize).toHaveBeenCalledWith({ token: authorization })
    expect(authorize).toHaveBeenCalledTimes(1)
  })
})
