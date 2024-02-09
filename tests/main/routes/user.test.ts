import { Repository } from 'typeorm'
import { Express } from 'express'
import { sign } from 'jsonwebtoken'
import request from 'supertest'

import { PgUser, PostgresDataSource } from '@/infrastructure/repositories/postgres'
import { PgTestHelper } from '@/tests/infrastructure/repositories/postgres'
import { jwtSecret } from '@/main/config/env'

describe('User Routes', () => {
  let app: Express
  let pgUserRepo: Repository<PgUser>
  beforeAll(async () => {
    await PgTestHelper.connect([PgUser])
    pgUserRepo = PgTestHelper.connection.getRepository(PgUser)
    jest.spyOn(PostgresDataSource, 'getRepository').mockReturnValue(pgUserRepo)
  })

  beforeEach(async () => {
    app = (await import('@/main/config')).app
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
    const uploadSpy = jest.fn()

    jest.mock('@/infrastructure/gateways/aws-s3-file-storage', () => ({
      AwsS3FileStorage: jest.fn().mockReturnValue({ upload: uploadSpy })
    }))

    it('Should return 403 if no authorization header is present', async () => {
      const { status } = await request(app)
        .put('/api/users/picture')

      expect(status).toBe(403)
    })
    it('Should return 200 with valid data ', async () => {
      uploadSpy.mockResolvedValueOnce('any_url')
      const { id } = await pgUserRepo.save({ email: 'any_email', name: 'any name' })

      const authorization = sign({ key: id }, jwtSecret)
      const { status, body } = await request(app)
        .put('/api/users/picture')
        .set({ authorization })
        .attach('picture', Buffer.from('any_buffer'), { filename: 'any_name', contentType: 'image/jpg' })

      expect(status).toBe(200)
      expect(body).toEqual({ pictureUrl: 'any_url', initials: undefined })
    })
  })
})
