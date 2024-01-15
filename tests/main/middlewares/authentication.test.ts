import { ForbiddenError } from '@/presentation/errors'
import { app } from '@/main/config'
import { auth } from '@/main/middlewares'
import { jwtSecret } from '@/main/config/env'

import request from 'supertest'
import { sign } from 'jsonwebtoken'

describe('AuthenticationMiddleware', () => {
  it('should return 403 if authorization header was not provided', async () => {
    app.get('/test-auth', auth)

    const { status, body } = await request(app).get('/test-auth')
    expect(status).toBe(403)
    expect(body.error).toEqual(new ForbiddenError().message)
  })
  it('Should return 200 if authorization header was provided', async () => {
    const authorization = sign({ key: 'any_user_id' }, jwtSecret)
    app.get('/test-auth', auth, (req, res) => {
      res.json(req.locals)
    })

    const { status, body } = await request(app)
      .get('/test-auth')
      .set('authorization', authorization)

    expect(status).toBe(200)
    expect(body).toEqual({ userId: 'any_user_id' })
  })
})
