import { SaveUserPicture } from '@/domain/ports'
import { PgUser, PostgresDataSource } from '@/infrastructure/repositories/postgres'

export class PgUserProfileRepository implements SaveUserPicture {
  async savePicture ({ id, initials, pictureUrl }: SaveUserPicture.Input): Promise<void> {
    /* istanbul ignore next */
    const value = { initials: initials ?? null!, pictureUrl: pictureUrl ?? null! }
    const pgUserRepo = PostgresDataSource.getRepository(PgUser)
    await pgUserRepo.update({ id: Number(id) }, { ...value })
  }
}
