import { dataSourceOptions } from '@/infrastructure/repositories/postgres/connection'
import { DataSource } from 'typeorm'

export class PgConnection {
  private static instance?: PgConnection
  private connection?: DataSource

  private constructor () {}

  private isConnectionInitialized (): boolean {
    return this.connection?.isInitialized ?? false
  }

  static getInstance (): PgConnection {
    PgConnection.instance === undefined && (PgConnection.instance = new PgConnection())
    return PgConnection.instance
  }

  async connect (): Promise<void> {
    if (!this.isConnectionInitialized()) {
      this.connection = new DataSource(dataSourceOptions)
      await this.connection.initialize()
    }

    this.connection?.createQueryRunner()
  }
}
