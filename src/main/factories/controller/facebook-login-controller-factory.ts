import { makeFacebookAuthenticationService } from '@/main/factories'
import { FacebookLoginController } from '@/presentation/controllers'

export const makeFacebookLoginController = (): FacebookLoginController => {
  const fbAuthService = makeFacebookAuthenticationService()
  return new FacebookLoginController(fbAuthService)
}
