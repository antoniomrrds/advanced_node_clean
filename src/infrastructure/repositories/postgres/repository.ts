import { PgConnection } from '@/infrastructure/repositories/postgres/helpers'
import { EntityTarget, ObjectLiteral, Repository } from 'typeorm'

export abstract class PgRepository {
  constructor (private readonly connection: PgConnection = PgConnection.getInstance()) {}

  protected getRepository<Entity extends ObjectLiteral>(entity: EntityTarget<Entity>): Repository<Entity> {
    return this.connection.getRepository(entity)
  }
}
