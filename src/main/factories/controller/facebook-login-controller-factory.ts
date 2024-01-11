import { makeFacebookAuthentication } from '@/main/factories'
import { FacebookLoginController } from '@/presentation/controllers'

export const makeFacebookLoginController = (): FacebookLoginController => {
  return new FacebookLoginController(makeFacebookAuthentication())
}
