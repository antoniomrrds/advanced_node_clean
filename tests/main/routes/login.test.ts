import request from 'supertest'
import { DataSource } from 'typeorm'

import { app } from '@/main/config'
import { makeFakeDb } from '@/tests/infrastructure/postgres/mocks'
import { PgUser } from '@/infrastructure/postgres/entities'
import { PostgresDataSource } from '@/infrastructure/postgres/config'
import { UnauthorizedError } from '@/presentation/errors'

describe('Login Routes', () => {
  describe('POST /login', () => {
    const loadUserSpy = jest.fn()
    beforeAll(async () => {
      const dataSource: DataSource = (await makeFakeDb([PgUser])).dataSource
      jest.spyOn(PostgresDataSource, 'getRepository').mockImplementation((entity) => {
        return dataSource.getRepository(entity)
      })
    })

    jest.mock('@/infrastructure/apis/facebook', () => ({
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
