import { PgUser } from '@/infrastructure/postgres/entities'
import { PgUserAccountRepository } from '@/infrastructure/postgres/repositories'
import { DataType, newDb } from 'pg-mem'

describe('PgUserAccountRepository', () => {
  describe('load', () => {
    it('Should return an account if email exists', async () => {
      const db = newDb({ autoCreateForeignKeyIndices: true })

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

      const dataSource = db.adapters.createTypeormDataSource({
        type: 'postgres',
        entities: [PgUser]
      })
      // Initialize datasource

      await dataSource.initialize()
      // create schema

      await dataSource.synchronize()

      const pgUserRepos = dataSource.getRepository(PgUser)

      // create schema
      await pgUserRepos.save({ email: 'existing_email' })

      const sut = new PgUserAccountRepository(dataSource)

      const account = await sut.load({ email: 'existing_email' })
      expect(account).toEqual({ id: '1' })
      await dataSource.destroy()
    })
    it('Should return undefined if email does not exist', async () => {
      const db = newDb({ autoCreateForeignKeyIndices: true })

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

      const dataSource = db.adapters.createTypeormDataSource({
        type: 'postgres',
        entities: [PgUser]
      })
      // Initialize datasource

      await dataSource.initialize()
      // create schema

      await dataSource.synchronize()

      const sut = new PgUserAccountRepository(dataSource)

      const account = await sut.load({ email: 'new_email' })
      expect(account).toBeUndefined()
      await dataSource.destroy()
    })
  })
})
