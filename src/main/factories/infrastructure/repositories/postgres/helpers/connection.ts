import { PgConnection } from '@/infrastructure/repositories/postgres'

export const makePgConnection = (): PgConnection => {
  return PgConnection.getInstance()
}
