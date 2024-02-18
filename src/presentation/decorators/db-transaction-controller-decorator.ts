import { Controller } from '@/presentation/controllers'
import { DBTransaction, HttpResponse } from '@/presentation/ports'

export class DbTransactionControllerDecorator {
  constructor (
    private readonly decoratee: Controller,
    private readonly db: DBTransaction

  ) {}

  async perform (httpRequest: any): Promise<HttpResponse | undefined> {
    await this.db.openTransaction()
    try {
      const httpResponse = await this.decoratee.perform(httpRequest)
      await this.db.commit()
      await this.db.closeTransaction()
      return httpResponse
    } catch (error) {
      await this.db.rollback()
      await this.db.closeTransaction()
    }
  }
}
