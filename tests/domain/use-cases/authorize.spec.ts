import { TokenValidator } from '@/domain/ports'
import { Authorize, setupAuthorize } from '@/domain/use-cases'
import { MockProxy, mock } from 'jest-mock-extended'

describe('FacebookAuthentication', () => {
  let crypto: MockProxy<TokenValidator>
  let sut: Authorize
  let token: string

  beforeAll(() => {
    token = 'any_token'
    crypto = mock()
  })

  beforeEach(() => {
    sut = setupAuthorize(crypto)
  })
  it('Should call TokenValidator with correct params', async () => {
    await sut({ token })

    expect(crypto.validateToken).toHaveBeenCalledWith({ token })
    expect(crypto.validateToken).toHaveBeenCalledTimes(1)
  })
})
