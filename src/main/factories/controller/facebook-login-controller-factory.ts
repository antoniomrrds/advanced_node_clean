import { makeFacebookAuthentication } from '@/main/factories'
import { FacebookLoginController } from '@/presentation/controllers'

export const makeFacebookLoginController = (): FacebookLoginController => {
  const fbAuthService = makeFacebookAuthentication()
  return new FacebookLoginController(fbAuthService)
}
