import { DBTransaction } from '@/presentation/ports'

export class DbTransactionControllerDecorator {
  constructor (private readonly db: DBTransaction) {}
  async perform (httpRequest: any): Promise<void> {
    await this.db.openTransaction()
  }
}
