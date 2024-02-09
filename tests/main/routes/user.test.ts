import request from 'supertest'
import { Repository } from 'typeorm'
import { sign } from 'jsonwebtoken'

import { PgTestHelper } from '@/tests/infrastructure/repositories/postgres'
import { PgUser, PostgresDataSource } from '@/infrastructure/repositories/postgres'
import { jwtSecret } from '@/main/config/env'
import { app } from '@/main/config'

describe('User Routes', () => {
  let pgUserRepo: Repository<PgUser>

  beforeAll(async () => {
    await PgTestHelper.connect([PgUser])
    pgUserRepo = PgTestHelper.connection.getRepository(PgUser)
    jest.spyOn(PostgresDataSource, 'getRepository').mockReturnValue(pgUserRepo)
  })

  beforeEach(async () => {
    PgTestHelper.restore()
  })

  afterAll(async () => {
    await PgTestHelper.disconnect()
  })
  describe('DELETE /api/users/picture', () => {
    it('Should return 403 if no authorization header is present', async () => {
      const { status } = await request(app)
        .delete('/api/users/picture')

      expect(status).toBe(403)
    })
    it('Should return 200 with valid data ', async () => {
      const { id } = await pgUserRepo.save({ email: 'any_email', name: 'any name' })

      const authorization = sign({ key: id }, jwtSecret)
      const { status, body } = await request(app)
        .delete('/api/users/picture')
        .set({ authorization })

      expect(status).toBe(200)
      expect(body).toEqual({ pictureUrl: undefined, initials: 'AN' })
    })
  })
  describe('PUT /api/users/picture', () => {
    it('Should return 403 if no authorization header is present', async () => {
      const { status } = await request(app)
        .put('/api/users/picture')

      expect(status).toBe(403)
    })
  })
})
