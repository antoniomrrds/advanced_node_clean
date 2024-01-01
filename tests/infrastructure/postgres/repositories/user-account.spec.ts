import { PgUser } from '@/infrastructure/postgres/entities'
import { PgUserAccountRepository } from '@/infrastructure/postgres/repositories'
import { DataSource, Repository } from 'typeorm'
import { IBackup } from 'pg-mem'
import { makeFakeDb } from '@/tests/infrastructure/postgres/mocks'

describe('PgUserAccountRepository', () => {
  let PostgresDataSource: DataSource
  let sut: PgUserAccountRepository
  let pgUserRepos: Repository<PgUser>
  let backup: IBackup

  beforeAll(async () => {
    const { db, dataSource } = await makeFakeDb()
    PostgresDataSource = dataSource
    backup = db.backup()
    pgUserRepos = PostgresDataSource.getRepository(PgUser)
  })

  beforeEach(() => {
    backup.restore()
    sut = new PgUserAccountRepository(PostgresDataSource)
  })

  afterAll(async () => {
    await PostgresDataSource.destroy()
  })
  describe('load', () => {
    it('Should return an account if email exists', async () => {
      // create schema
      await pgUserRepos.save({ email: 'existing_email' })

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
      await sut.saveWithFacebook({
        email: 'any_email',
        name: 'any_name',
        facebookId: 'any_fb_id'
      })

      const pgUser = await pgUserRepos.findOne({ where: { email: 'any_email' } })
      expect(pgUser?.id).toBe(1)
      expect(pgUser?.name).toBe('any_name')
      expect(pgUser?.facebookId).toBe('any_fb_id')
    })

    it('Should update an account if id is defined', async () => {
      await pgUserRepos.save({
        email: 'any_email',
        name: 'any_name',
        facebookId: 'any_fb_id'
      })

      await sut.saveWithFacebook({
        id: '1',
        email: 'new_email',
        name: 'new_name',
        facebookId: 'new_fb_id'
      })

      const pgUser = await pgUserRepos.findOne({ where: { id: 1 } })
      expect(pgUser).toEqual({
        id: 1,
        email: 'any_email',
        name: 'new_name',
        facebookId: 'new_fb_id'
      })
    })
  })
})
