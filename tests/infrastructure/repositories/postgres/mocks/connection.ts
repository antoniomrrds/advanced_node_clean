import { DataType, newDb, IMemoryDb, IBackup } from 'pg-mem'
import { DataSource, ObjectLiteral } from 'typeorm'
import { v4 as uuid } from 'uuid'

import { EntityTarget } from 'typeorm/common/EntityTarget'
import { Repository } from 'typeorm/repository/Repository'

export const PgTestHelper = {
  db: null as unknown as IMemoryDb,
  connection: null as unknown as DataSource,
  backup: null as unknown as IBackup,
  async connect (entities?: any[]) {
    this.db = newDb()
    this.db.registerExtension('uuid-ossp', (schema) => {
      schema.registerFunction({
        name: 'uuid_generate_v4',
        returns: DataType.uuid,
        implementation: () => uuid(),
        impure: true
      })
    })
    this.db.public.registerFunction({
      implementation: () => 'test',
      name: 'current_database'
    })
    this.db.public.registerFunction({
      implementation: () => 'test',
      name: 'version'
    })
    this.connection = await this.db.adapters.createTypeormDataSource({
      type: 'postgres',
      entities: entities ?? ['src/infrastructure/repositories/postgres/entities/index.ts'],
      logging: false
    })
    await this.initialize()
    await this.sync()
    this.backup = this.db.backup()
  },
  getRepository<Entity extends ObjectLiteral>(name: EntityTarget<Entity>): Repository<Entity> {
    return this.connection.getRepository<Entity>(name)
  },
  async initialize () {
    await this.connection.initialize()
  },
  async disconnect () {
    await this.connection.destroy()
  },
  restore () {
    this.backup.restore()
  },
  async sync () {
    await this.connection.synchronize()
  }
}
