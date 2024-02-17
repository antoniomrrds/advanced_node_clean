import { PgUser, PgUserProfileRepository, PgConnection } from '@/infrastructure/repositories/postgres'
import { PgRepository } from '@/infrastructure/repositories/postgres/repository'
import { PgTestHelper } from '@/tests/infrastructure/repositories/postgres'
import { Repository } from 'typeorm'

describe('PgUserProfileRepository', () => {
  let sut: PgUserProfileRepository
  let pgUserRepo: Repository<PgUser>
  let connection: PgConnection

  beforeAll(async () => {
    await PgTestHelper.connect([PgUser])
    connection = PgConnection.getInstance()
    pgUserRepo = connection.getRepository(PgUser)
  })

  beforeEach(() => {
    PgTestHelper.restore()
    sut = new PgUserProfileRepository()
  })

  afterAll(async () => {
    await connection.disconnect()
  })

  it('Should extend PgRepository', () => {
    expect(sut).toBeInstanceOf(PgRepository)
  })

  describe('SavePicture', () => {
    it('Should update user profile', async () => {
      const { id } = await pgUserRepo.save({ email: 'any_email', initials: 'any_initials' })

      await sut.savePicture({ id: id.toString(), pictureUrl: 'any_url' })
      const pgUser = await pgUserRepo.findOne({ where: { id } })

      expect(pgUser).toMatchObject({ id, initials: null, pictureUrl: 'any_url' })
    })
  })
  describe('LoadUserProfile', () => {
    it('Should load user profile', async () => {
      const { id } = await pgUserRepo.save({ email: 'any_email', name: 'any_name' })

      const userProfile = await sut.load({ id: id.toString() })

      expect(userProfile?.name).toBe('any_name')
    })
    it('Should load user profile name as undefined', async () => {
      const { id } = await pgUserRepo.save({ email: 'any_email' })

      const userProfile = await sut.load({ id: id.toString() })

      expect(userProfile?.name).toBeUndefined()
    })

    it('Should return undefined if user is not found', async () => {
      const userProfile = await sut.load({ id: '1' })

      expect(userProfile).toBeUndefined()
    })
  })
})
