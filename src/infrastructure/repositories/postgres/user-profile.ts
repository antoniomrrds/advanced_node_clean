import { LoadUserProfile, SaveUserPicture } from '@/domain/ports'
import { PgUser } from '@/infrastructure/repositories/postgres'
import { PgRepository } from '@/infrastructure/repositories/postgres/repository'

export class PgUserProfileRepository extends PgRepository implements SaveUserPicture, LoadUserProfile {
  async savePicture ({ id, initials, pictureUrl }: SaveUserPicture.Input): Promise<void> {
    const pgUserRepo = this.getRepository(PgUser)
    await pgUserRepo.query('UPDATE usuarios SET iniciais = $1, foto = $2 WHERE id = $3 ', [initials, pictureUrl, Number(id)])
  }

  async load ({ id }: LoadUserProfile.Input): Promise< LoadUserProfile.Output> {
    const pgUserRepo = this.getRepository(PgUser)
    const pgUser = await pgUserRepo.findOne({ where: { id: Number(id) } })
    if (pgUser !== null) return { name: pgUser.name ?? undefined }
  }
}
