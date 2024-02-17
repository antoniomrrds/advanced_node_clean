import request from 'supertest'
import { Express } from 'express'

import { PgTestHelper } from '@/tests/infrastructure/repositories/postgres'
import { PgConnection, PgUser } from '@/infrastructure/repositories/postgres'
import { UnauthorizedError } from '@/presentation/errors'

describe('Login Routes', () => {
  let app: Express
  let connection: PgConnection

  beforeAll(async () => {
    await PgTestHelper.connect([PgUser])
    connection = PgConnection.getInstance()
  })

  beforeEach(async () => {
    app = (await import('@/main/config')).app
    PgTestHelper.restore()
  })

  afterAll(async () => {
    await connection.disconnect()
  })

  describe('POST /login', () => {
    const loadUserSpy = jest.fn()
    jest.mock('@/infrastructure/gateways/facebook-api', () => ({
      FacebookApi: jest.fn().mockReturnValue({ loadUser: loadUserSpy })
    }))

    it('should return 200 with AccessToken', async () => {
      loadUserSpy.mockResolvedValueOnce({ facebookId: 'any_facebook_id', name: 'any_name', email: 'any_email' })
      const { status, body } = await request(app)
        .post('/api/login/facebook')
        .send({ token: 'valid_token' })

      expect(status).toBe(200)
      expect(body.accessToken).toBeTruthy()
    })
    it('should return 401 with invalid credentials', async () => {
      const { status, body } = await request(app)
        .post('/api/login/facebook')
        .send({ token: 'invalid_token' })

      expect(status).toBe(401)
      expect(body.error).toBe(new UnauthorizedError().message)
    })
  })
})
