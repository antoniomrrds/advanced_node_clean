import { JwtTokenGenerator } from '@/infrastructure/crypto'
import { jwtSecret } from '@/main/config/env'

export const makeJwtTokenGenerator = (): JwtTokenGenerator => {
  return new JwtTokenGenerator(jwtSecret)
}
