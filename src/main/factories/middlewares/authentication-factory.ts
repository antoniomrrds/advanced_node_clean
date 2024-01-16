import { makeJwtTokenHandler } from '@/main/factories/crypto'
import { AuthenticationMiddleware } from '@/presentation/middlewares'

export const makeAuthenticationMiddleware = (): AuthenticationMiddleware => {
  const jwt = makeJwtTokenHandler()
  return new AuthenticationMiddleware(jwt.validate.bind(jwt))
}
