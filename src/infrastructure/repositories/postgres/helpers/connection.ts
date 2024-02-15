import { dataSourceOptions, ConnectionNotFoundError } from '@/infrastructure/repositories/postgres'
import { DataSource, QueryRunner } from 'typeorm'

export class PgConnection {
  private static instance?: PgConnection
  private connection?: DataSource
  private query?: QueryRunner

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

    this.query = this.connection?.createQueryRunner()
  }

  async disconnect (): Promise<void> {
    this.query?.startTransaction()
    if (this.query === undefined || this.connection === undefined) throw new ConnectionNotFoundError()
    await this.connection.destroy()
    this.query = undefined
    this.connection = undefined
  }

  async openTransaction (): Promise<void> {
    if (this.query === undefined) throw new ConnectionNotFoundError()
    await this.query.startTransaction()
  }
}
