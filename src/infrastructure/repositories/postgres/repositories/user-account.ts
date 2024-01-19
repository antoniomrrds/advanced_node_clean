import { LoadUserAccount, SaveFacebookAccount } from '@/domain/ports'
import { PgUser, PostgresDataSource } from '@/infrastructure/repositories/postgres'

type loadInput = LoadUserAccount.Input
type loadOutput = LoadUserAccount.Output
type saveInput = SaveFacebookAccount.Input
type saveOutput = SaveFacebookAccount.Output

export class PgUserAccountRepository implements LoadUserAccount, SaveFacebookAccount {
  async load ({ email }: loadInput): Promise<loadOutput> {
    const pgUserRepos = PostgresDataSource.getRepository(PgUser)
    const pgUser = await pgUserRepos.findOne({ where: { email } })
    if (pgUser) {
      return { id: pgUser.id.toString(), name: pgUser.name ?? undefined }
    }
  }

  async saveWithFacebook ({ id, name, facebookId, email }: saveInput): Promise<saveOutput> {
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
