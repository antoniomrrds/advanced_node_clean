import { PgConnection, PgUser, PgUserAccountRepository } from '@/infrastructure/repositories/postgres'
import { PgRepository } from '@/infrastructure/repositories/postgres/repository'
import { PgTestHelper } from '@/tests/infrastructure/repositories/postgres'
import { Repository } from 'typeorm'

describe('PgUserAccountRepository', () => {
  let sut: PgUserAccountRepository
  let pgUserRepo: Repository<PgUser>
  let connection: PgConnection

  beforeAll(async () => {
    await PgTestHelper.connect([PgUser])
    connection = PgConnection.getInstance()
    pgUserRepo = connection.getRepository(PgUser)
  })

  beforeEach(() => {
    PgTestHelper.restore()
    sut = new PgUserAccountRepository()
  })
  afterAll(async () => {
    await connection.disconnect()
  })

  it('Should extend PgRepository', () => {
    expect(sut).toBeInstanceOf(PgRepository)
  })

  describe('load', () => {
    it('Should return an account if email exists', async () => {
      await pgUserRepo.save({ email: 'existing_email' })

      const account = await sut.load({ email: 'existing_email' })
      expect(account).toEqual({ id: '1' })
    })
    it('Should return undefined if email does not exist', async () => {
      const account = await sut.load({ email: 'new_email' })

      expect(account).toBeUndefined()
    })
  })

  describe('saveWithFacebook', () => {
    it('Should create an account if id is undefined', async () => {
      const { id } = await sut.saveWithFacebook({
        email: 'any_email',
        name: 'any_name',
        facebookId: 'any_fb_id'
      })

      const pgUser = await pgUserRepo.findOne({ where: { email: 'any_email' } })
      expect(id).toBe('1')
      expect(pgUser?.id).toBe(1)
      expect(pgUser?.name).toBe('any_name')
      expect(pgUser?.facebookId).toBe('any_fb_id')
    })

    it('Should update an account if id is defined', async () => {
      await pgUserRepo.save({
        email: 'any_email',
        name: 'any_name',
        facebookId: 'any_fb_id'
      })

      const { id } = await sut.saveWithFacebook({
        id: '1',
        email: 'new_email',
        name: 'new_name',
        facebookId: 'new_fb_id'
      })

      const pgUser = await pgUserRepo.findOne({ where: { id: 1 } })
      expect(pgUser).toMatchObject({
        id: 1,
        email: 'any_email',
        name: 'new_name',
        facebookId: 'new_fb_id'
      })
      expect(id).toBe('1')
    })
  })
})
