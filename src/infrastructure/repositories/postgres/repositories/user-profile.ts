import { LoadUserProfile, SaveUserPicture } from '@/domain/ports'
import { PgUser, PostgresDataSource } from '@/infrastructure/repositories/postgres'
export class PgUserProfileRepository implements SaveUserPicture, LoadUserProfile {
  async savePicture ({ id, initials, pictureUrl }: SaveUserPicture.Input): Promise<void> {
    const pgUserRepo = PostgresDataSource.getRepository(PgUser)
    await pgUserRepo.query('UPDATE usuarios SET iniciais = $1, foto = $2 WHERE id = $3 ', [initials, pictureUrl, Number(id)])
  }

  async load ({ id }: LoadUserProfile.Input): Promise< LoadUserProfile.Output> {
    const pgUserRepo = PostgresDataSource.getRepository(PgUser)
    const pgUser = await pgUserRepo.findOne({ where: { id: Number(id) } })
    if (pgUser !== null) return { name: pgUser.name ?? undefined }
  }
}
