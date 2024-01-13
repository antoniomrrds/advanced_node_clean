import { ForbiddenError } from '@/presentation/errors'
import { AuthenticationMiddleware } from '@/presentation/middlewares'

describe('AuthenticationMiddleware', () => {
  let sut: AuthenticationMiddleware

  beforeEach(() => {
    sut = new AuthenticationMiddleware()
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
})
