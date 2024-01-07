import { PostgresDataSource } from '@/infrastructure/postgres/config'
import { PgUserAccountRepository } from '@/infrastructure/postgres/repositories'

export const makePgUserAccountRepo = (): PgUserAccountRepository => {
  return new PgUserAccountRepository(PostgresDataSource)
}
