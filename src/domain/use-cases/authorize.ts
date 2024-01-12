import { TokenValidator } from '@/domain/ports'

type Setup = (crypto: TokenValidator) => Authorize
type Input = { token: string }
export type Authorize = (params: Input) => Promise<void>

export const setupAuthorize: Setup = crypto => async params => {
  await crypto.validateToken(params)
}
