import { adaptExpressRoute as adapt } from '@/infrastructure/http'
import { makeFacebookLoginController } from '@/main/factories'
import { Router } from 'express'

export default (router: Router): void => {
  router.post('/login/facebook', adapt(makeFacebookLoginController()))
}
