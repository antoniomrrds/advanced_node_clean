import { dataSourceOptions, TransactionNotFoundError, ConnectionNotFoundError } from '@/infrastructure/repositories/postgres'
import { DbTransaction } from '@/presentation/ports'
import { DataSource, EntityTarget, ObjectLiteral, QueryRunner, Repository } from 'typeorm'

export class PgConnection implements DbTransaction {
  private static instance?: PgConnection
  private connection?: DataSource
  private query?: QueryRunner

  private constructor () {}

  static getInstance (): PgConnection {
    PgConnection.instance === undefined && (PgConnection.instance = new PgConnection())
    return PgConnection.instance
  }

  private async createConnection (): Promise<void> {
    this.connection = new DataSource(dataSourceOptions)
    await this.connection.initialize()
  }

  private isConnectionInitialized (): boolean {
    return this.connection?.isInitialized ?? false
  }

  setConnection (connection: DataSource): void {
    this.connection = connection
  }

  async connect (): Promise<void> {
    (!this.isConnectionInitialized()) && await this.createConnection()
  }

  async disconnect (): Promise<void> {
    if (this.connection === undefined) throw new ConnectionNotFoundError()
    await this.connection.destroy()
    this.query = undefined
    this.connection = undefined
  }

  async openTransaction (): Promise<void> {
    if (this.connection === undefined) throw new ConnectionNotFoundError()
    this.query = this.connection.createQueryRunner()
    await this.query.startTransaction()
  }

  async closeTransaction (): Promise<void> {
    if (this.query === undefined) throw new TransactionNotFoundError()
    await this.query.release()
  }

  async commitTransaction (): Promise<void> {
    if (this.query === undefined) throw new TransactionNotFoundError()
    await this.query.commitTransaction()
  }

  async rollbackTransaction (): Promise<void> {
    if (this.query === undefined) throw new TransactionNotFoundError()
    await this.query.rollbackTransaction()
  }

  getRepository<Entity extends ObjectLiteral>(entity: EntityTarget<Entity>): Repository<Entity> {
    if (this.connection === undefined) throw new ConnectionNotFoundError()
    return (this.query !== undefined)
      ? this.query.manager.getRepository(entity)
      : this.connection.getRepository(entity)
  }
}
