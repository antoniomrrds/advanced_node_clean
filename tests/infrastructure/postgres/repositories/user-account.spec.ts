import { PgUser } from '@/infrastructure/postgres/entities'
import { PgUserAccountRepository } from '@/infrastructure/postgres/repositories'
import { DataSource, Repository } from 'typeorm'
import { DataType, newDb, IMemoryDb, IBackup } from 'pg-mem'

describe('PgUserAccountRepository', () => {
  let dataSource: DataSource

  describe('load', () => {
    let sut: PgUserAccountRepository
    let pgUserRepos: Repository<PgUser>
    let db: IMemoryDb
    let backup: IBackup

    beforeAll(async () => {
      db = newDb({ autoCreateForeignKeyIndices: true })

      db.public.registerFunction({
        name: 'current_database',
        args: [],
        returns: DataType.text,
        implementation: (x) => `hello world: ${x}`
      })

      db.public.registerFunction({
        name: 'version',
        args: [],
        returns: DataType.text,
        implementation: (x) => `hello world: ${x}`
      })

      dataSource = db.adapters.createTypeormDataSource({
        type: 'postgres',
        entities: [PgUser]
      })
      // Initialize datasource

      await dataSource.initialize()
      // create schema

      await dataSource.synchronize()
      backup = db.backup()
      pgUserRepos = dataSource.getRepository(PgUser)
    })

    beforeEach(() => {
      backup.restore()
      sut = new PgUserAccountRepository(dataSource)
    })

    afterAll(async () => {
      await dataSource.destroy()
    })
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
})
