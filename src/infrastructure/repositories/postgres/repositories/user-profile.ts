import { LoadUserProfile, SaveUserPicture } from '@/domain/ports'
import { PgUser, PostgresDataSource } from '@/infrastructure/repositories/postgres'

export class PgUserProfileRepository implements SaveUserPicture, LoadUserProfile {
  async savePicture ({ id, initials, pictureUrl }: SaveUserPicture.Input): Promise<void> {
    /* istanbul ignore next */
    const value = { initials: initials ?? null!, pictureUrl: pictureUrl ?? null! }
    const pgUserRepo = PostgresDataSource.getRepository(PgUser)
    await pgUserRepo.update({ id: Number(id) }, { ...value })
  }

  async load ({ id }: LoadUserProfile.Input): Promise< LoadUserProfile.Output> {
    const pgUserRepo = PostgresDataSource.getRepository(PgUser)
    const pgUser = await pgUserRepo.findOne({ where: { id: Number(id) } })
    if (pgUser !== null) return { name: pgUser.name }
  }
}
