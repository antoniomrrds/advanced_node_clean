import { PgUser, PostgresDataSource, PgUserProfileRepository } from '@/infrastructure/repositories/postgres'
import { PgTestHelper } from '@/tests/infrastructure/repositories/postgres'
import { Repository } from 'typeorm'

describe('PgUserProfileRepository', () => {
  let sut: PgUserProfileRepository
  let pgUserRepo: Repository<PgUser>

  beforeAll(async () => {
    await PgTestHelper.connect([PgUser])
    pgUserRepo = PgTestHelper.connection.getRepository(PgUser)
    jest.spyOn(PostgresDataSource, 'getRepository').mockReturnValue(pgUserRepo)
  })

  beforeEach(() => {
    PgTestHelper.restore()
    sut = new PgUserProfileRepository()
  })

  afterAll(async () => {
    await PgTestHelper.disconnect()
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
  })
})
