import { adaptExpressMiddleware } from '@/main/adapters'
import { makeAuthenticationMiddleware } from '@/main/factories/presentation'

export const auth = adaptExpressMiddleware(makeAuthenticationMiddleware())
