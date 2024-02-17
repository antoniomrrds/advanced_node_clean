import { LoadUserAccount, SaveFacebookAccount } from '@/domain/ports'
import { PgUser } from '@/infrastructure/repositories/postgres'
import { PgRepository } from '@/infrastructure/repositories/postgres/repository'

type loadInput = LoadUserAccount.Input
type loadOutput = LoadUserAccount.Output
type saveInput = SaveFacebookAccount.Input
type saveOutput = SaveFacebookAccount.Output

export class PgUserAccountRepository extends PgRepository implements LoadUserAccount, SaveFacebookAccount {
  async load ({ email }: loadInput): Promise<loadOutput> {
    const pgUserRepo = this.getRepository(PgUser)
    const pgUser = await pgUserRepo.findOne({ where: { email } })
    if (pgUser) {
      return { id: pgUser.id.toString(), name: pgUser.name ?? undefined }
    }
  }

  async saveWithFacebook ({ id, name, facebookId, email }: saveInput): Promise<saveOutput> {
    let resultId: string
    const pgUserRepo = this.getRepository(PgUser)

    if (id === undefined) {
      const pgUser = await pgUserRepo.save({ email, name, facebookId })
      resultId = pgUser.id.toString()
    } else {
      resultId = id
      await pgUserRepo.update({ id: Number(id) }, { name, facebookId })
    }
    return { id: resultId }
  }
}
