import request from 'supertest'

import { PgTestHelper } from '@/tests/infrastructure/repositories/postgres'
import { PgUser, PostgresDataSource } from '@/infrastructure/repositories/postgres'
import { Express } from 'express'

describe('User Routes', () => {
  let app: Express

  beforeEach(async () => {
    app = (await import('@/main/config')).app
  })

  beforeAll(async () => {
    await PgTestHelper.connect([PgUser])
    const pgUserRepo = PgTestHelper.connection.getRepository(PgUser)
    jest.spyOn(PostgresDataSource, 'getRepository').mockReturnValue(pgUserRepo)
  })

  it('should return 403 if no authorization header is present', async () => {
    const { status } = await request(app)
      .delete('/api/users/picture')

    expect(status).toBe(403)
  })
})
