import { Controller } from '@/presentation/controllers'
import { DBTransaction } from '@/presentation/ports'

export class DbTransactionControllerDecorator {
  constructor (
    private readonly decoratee: Controller,
    private readonly db: DBTransaction

  ) {}

  async perform (httpRequest: any): Promise<void> {
    await this.db.openTransaction()
    await this.decoratee.perform(httpRequest)
    await this.db.commit()
    await this.db.closeTransaction()
  }
}
