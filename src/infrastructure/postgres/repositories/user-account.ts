import { LoadUserAccountRepository } from '@/application/ports'

import { DataSource, Repository } from 'typeorm'
import { PgUser } from '@/infrastructure/postgres/entities'

export class PgUserAccountRepository implements LoadUserAccountRepository {
  private readonly pgUserRepos: Repository<PgUser>

  constructor (dataSource: DataSource) {
    this.pgUserRepos = dataSource.getRepository(PgUser)
  }

  async load (params: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
    const pgUser = await this.pgUserRepos.findOne({ where: { email: params.email } })
    if (pgUser) {
      return { id: pgUser.id.toString(), name: pgUser.name ?? undefined }
    }
  }
}
