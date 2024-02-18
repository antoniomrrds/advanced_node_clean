import { PgUserAccountRepository } from '@/infrastructure/repositories/postgres'

export const makePgUserAccountRepo = (): PgUserAccountRepository => {
  return new PgUserAccountRepository()
}
