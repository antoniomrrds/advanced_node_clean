import { PgUserAccountRepository } from '@/infrastructure/postgres/repositories'

export const makePgUserAccountRepo = (): PgUserAccountRepository => {
  return new PgUserAccountRepository()
}
