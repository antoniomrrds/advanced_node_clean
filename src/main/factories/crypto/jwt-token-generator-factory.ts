import { JwtTokenHandler } from '@/infrastructure/crypto'
import { jwtSecret } from '@/main/config/env'

export const makeJwtTokenHandler = (): JwtTokenHandler => {
  return new JwtTokenHandler(jwtSecret)
}
