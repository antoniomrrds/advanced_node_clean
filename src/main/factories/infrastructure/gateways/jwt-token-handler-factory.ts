import { JwtTokenHandler } from '@/infrastructure/gateways'
import { jwtSecret } from '@/main/config/env'

export const makeJwtTokenHandler = (): JwtTokenHandler => {
  return new JwtTokenHandler(jwtSecret)
}
