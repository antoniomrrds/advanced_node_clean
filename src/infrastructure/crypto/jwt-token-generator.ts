import { TokenGenerator } from '@/application/ports'
import { sign } from 'jsonwebtoken'
export class JwtTokenGenerator implements TokenGenerator {
  constructor (private readonly secret: string) {}
  async generateToken (params: TokenGenerator.Params): Promise<TokenGenerator.Result> {
    const expirationInSeconds = params.expirationInMs / 1000
    sign({ key: params.key }, this.secret, { expiresIn: expirationInSeconds })
    return 'any_value'
  }
}
