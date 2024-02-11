import { PostgresDataSource } from '@/infrastructure/repositories/postgres/connection'

export class PgConnection {
  private static instance?: PgConnection

  private constructor () {}

  static getInstance (): PgConnection {
    PgConnection.instance === undefined && (PgConnection.instance = new PgConnection())
    return PgConnection.instance
  }

  async connect (): Promise<void> {
    await PostgresDataSource.initialize()
    PostgresDataSource.createQueryRunner()
  }
}
