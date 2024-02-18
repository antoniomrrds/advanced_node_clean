import { makePgConnection } from '@/main/factories/infrastructure'
import { Controller } from '@/presentation/controllers'
import { DbTransactionController } from '@/presentation/decorators'

export const makePgTransactionController = (controller: Controller): Controller => {
  return new DbTransactionController(controller, makePgConnection())
}
