import { ForbiddenError } from '@/presentation/errors'
import { app } from '@/main/config'

import request from 'supertest'
import { auth } from '@/main/middlewares'

describe('AuthenticationMiddleware', () => {
  it('should return 403 if authorization header was not provided', async () => {
    app.get('/test-auth', auth)

    const { status, body } = await request(app).get('/test-auth')
    expect(status).toBe(403)
    expect(body.error).toEqual(new ForbiddenError().message)
  })
})
