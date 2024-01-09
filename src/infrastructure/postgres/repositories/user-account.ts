import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/application/ports'
import { PostgresDataSource } from '@/infrastructure/postgres/config'
import { PgUser } from '@/infrastructure/postgres/entities'

type loadParams = LoadUserAccountRepository.Params
type loadResult = LoadUserAccountRepository.Result
type saveParams = SaveFacebookAccountRepository.Params
type saveResult = SaveFacebookAccountRepository.Result

export class PgUserAccountRepository implements LoadUserAccountRepository, SaveFacebookAccountRepository {
  async load ({ email }: loadParams): Promise<loadResult> {
    const pgUserRepos = PostgresDataSource.getRepository(PgUser)
    const pgUser = await pgUserRepos.findOne({ where: { email } })
    if (pgUser) {
      return { id: pgUser.id.toString(), name: pgUser.name ?? undefined }
    }
  }

  async saveWithFacebook ({ id, name, facebookId, email }: saveParams): Promise<saveResult> {
    let resultId: string
    const pgUserRepos = PostgresDataSource.getRepository(PgUser)

    if (id === undefined) {
      const pgUser = await pgUserRepos.save({ email, name, facebookId })
      resultId = pgUser.id.toString()
    } else {
      resultId = id
      await pgUserRepos.update({ id: Number(id) }, { name, facebookId })
    }
    return { id: resultId }
  }
}
