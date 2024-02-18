import { PgUserProfileRepository } from '@/infrastructure/repositories/postgres'

export const makePgUserProfileRepo = (): PgUserProfileRepository => {
  return new PgUserProfileRepository()
}
