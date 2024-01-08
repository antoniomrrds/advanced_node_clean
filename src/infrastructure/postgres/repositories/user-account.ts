import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/application/ports'

import { DataSource, Repository } from 'typeorm'
import { PgUser } from '@/infrastructure/postgres/entities'

type loadParams = LoadUserAccountRepository.Params
type loadResult = LoadUserAccountRepository.Result
type saveParams = SaveFacebookAccountRepository.Params
type saveResult = SaveFacebookAccountRepository.Result

export class PgUserAccountRepository implements LoadUserAccountRepository, SaveFacebookAccountRepository {
  private readonly pgUserRepos: Repository<PgUser>

  constructor (dataSource: DataSource) {
    this.pgUserRepos = dataSource.getRepository(PgUser)
  }

  async load ({ email }: loadParams): Promise<loadResult> {
    const pgUser = await this.pgUserRepos.findOne({ where: { email } })
    if (pgUser) {
      return { id: pgUser.id.toString(), name: pgUser.name ?? undefined }
    }
  }

  async saveWithFacebook ({ id, name, facebookId, email }: saveParams): Promise<saveResult> {
    let resultId: string
    if (id === undefined) {
      const pgUser = await this.pgUserRepos.save({ email, name, facebookId })
      resultId = pgUser.id.toString()
    } else {
      resultId = id
      await this.pgUserRepos.update({ id: Number(id) }, { name, facebookId })
    }
    return { id: resultId }
  }
}
