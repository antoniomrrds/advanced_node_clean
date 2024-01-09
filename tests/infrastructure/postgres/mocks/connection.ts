import { DataType, newDb, IMemoryDb } from 'pg-mem'
import { DataSource } from 'typeorm'
export const makeFakeDb = async (entities?: any[]): Promise<{ dataSource: DataSource, db: IMemoryDb }> => {
  const db = newDb({ autoCreateForeignKeyIndices: true })

  db.public.registerFunction({
    name: 'current_database',
    args: [],
    returns: DataType.text,
    implementation: (x) => `hello world: ${x}`
  })

  db.public.registerFunction({
    name: 'version',
    args: [],
    returns: DataType.text,
    implementation: (x) => `hello world: ${x}`
  })

  const dataSource = db.adapters.createTypeormDataSource({
    type: 'postgres',
    entities: entities ?? ['src/infra/repos/postgres/entities/index.ts']
  })
  // Initialize datasource

  await dataSource.initialize()
  // create schema

  await dataSource.synchronize()

  return { dataSource, db }
}
