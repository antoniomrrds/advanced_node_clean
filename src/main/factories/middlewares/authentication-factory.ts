import { setupAuthorize } from '@/domain/use-cases'
import { makeJwtTokenHandler } from '@/main/factories/crypto'
import { AuthenticationMiddleware } from '@/presentation/middlewares'

export const makeAuthenticationMiddleware = (): AuthenticationMiddleware => {
  const authorize = setupAuthorize(makeJwtTokenHandler())
  return new AuthenticationMiddleware(authorize)
}
