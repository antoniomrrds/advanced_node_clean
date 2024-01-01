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

  async load (params: loadParams): Promise<loadResult> {
    const pgUser = await this.pgUserRepos.findOne({ where: { email: params.email } })
    if (pgUser) {
      return { id: pgUser.id.toString(), name: pgUser.name ?? undefined }
    }
  }

  async saveWithFacebook (params: saveParams): Promise<saveResult> {
    let id: string
    if (params.id === undefined) {
      const pgUser = await this.pgUserRepos.save({
        email: params.email,
        name: params.name,
        facebookId: params.facebookId
      })
      id = pgUser.id.toString()
    } else {
      id = params.id
      await this.pgUserRepos.update({ id: Number(params.id) }, {
        name: params.name,
        facebookId: params.facebookId
      })
    }
    return { id }
  }
}
