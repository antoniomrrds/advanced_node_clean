import { Controller } from '@/presentation/controllers'
import { DBTransaction, HttpResponse } from '@/presentation/ports'

export class DbTransactionControllerDecorator extends Controller {
  constructor (
    private readonly decoratee: Controller,
    private readonly db: DBTransaction
  ) {
    super()
  }

  async perform (httpRequest: any): Promise<HttpResponse> {
    await this.db.openTransaction()
    try {
      const httpResponse = await this.decoratee.perform(httpRequest)
      await this.db.commit()
      return httpResponse
    } catch (error) {
      await this.db.rollback()
      throw error
    } finally {
      await this.db.closeTransaction()
    }
  }
}
